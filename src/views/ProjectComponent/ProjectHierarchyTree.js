import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import PropTypes from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { useTreeItem, treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FaBriefcase, FaUserAlt } from "react-icons/fa";
import { signal } from "@preact/signals";
import axios from "axios";
import { environment } from "../../environments/environment";
import "./projecthierarchy.scss";
import clsx from "clsx";
import Box from "@mui/material/Box";
import competenciesTable from "../ProgressComponent/competenciesTable";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
const baseUrl = environment.baseUrl;

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};
const competencyTableData = signal([]);

const ProjectHierarchyTree = React.memo(
  (props) => {
    const {
      defaultExpandedRows,
      data,
      setFlag,
      flag,
      setTableData,
      projectName,
      hierarchyCount,
    } = props;
    const [dataProjectId, setDataProjectId] = useState("");
    let modData;
    const jsonToTree = (flatArray, options) => {
      options = {
        id: "id",
        parentId: "parent",
        children: "subrows",
        ...options,
      };
      const dictionary = {}; // a hash table mapping to the specific array objects with their ids as key
      const tree = [];
      const children = options.children;
      flatArray.forEach((node) => {
        const nodeId = node[options.id];
        const nodeParentId = node[options.parentId];
        // set up current node data in dictionary
        dictionary[nodeId] = {
          [children]: [], // init a children property
          ...node, // add other propertys
          ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
        };
        dictionary[nodeParentId] = dictionary[nodeParentId] || {
          [children]: [],
        }; // if it's not exist in dictionary, init an object with children property
        dictionary[nodeParentId][children].push(dictionary[nodeId]); // add reference to current node object in parent node object
      });
      // find root nodes
      Object.values(dictionary).forEach((obj) => {
        if (typeof obj[options.id] === "undefined") {
          tree.push(...obj[children]);
        }
      });
      return tree;
    };

    const hierarchy = jsonToTree(data);

    const fromDate = new Date(projectName.projectFromDate);
    const date = new Date(fromDate);
    const formattedFromDate = `${date.getDate()} ${date.toLocaleString(
      "default",
      { month: "short" }
    )} ${date.getFullYear()}`;

    const toDate = new Date(projectName.projectToDate);
    const tdate = new Date(toDate);
    const formattedToDate = `${tdate.getDate()} ${tdate.toLocaleString(
      "default",
      { month: "short" }
    )} ${tdate.getFullYear()}`;

    let a1 = document.getElementsByClassName("iconContainer");

    useEffect(() => {
      setTimeout(() => {
        addFolderIcon();
      }, 500);

      let aa = document.getElementsByClassName(
        "MuiTreeView-root hierarchyTree"
      );

      document.addEventListener(
        "click",
        function (params) {
          setTimeout(() => {
            const boxes = Array.from(
              document.getElementsByClassName("iconContainer")
            );
            let bb = Array.from(boxes[0].children);
            bb.forEach((box) => {
              if (box.tagName == "SPAN") {
                box.remove();
              }
            });

            if (a1[0]?.children[1]?.tagName == "SPAN") {
              return;
            }
            addFolderIcon();
          }, 500);
        },
        true
      );
    }, []);

    const addFolderIcon = () => {
      let spn = document.createElement("span");
      spn.innerHTML =
        '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="hierarchyIcons folder" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z"></path></svg>';
      a1[0].appendChild(spn);
    };

    // expand and collapse only when click on icon(plus or minus icons) not on element
    const CustomContent = React.forwardRef(function CustomContent(props, ref) {
      const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
      } = props;

      const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
      } = useTreeItem(nodeId);

      const icon = iconProp || expansionIcon || displayIcon;

      const handleMouseDown = (event) => {
        preventSelection(event);
      };

      const handleExpansionClick = (event) => {
        handleExpansion(event);
      };

      const handleSelectionClick = async (event) => {
        // debugger;
        handleSelection(event);
        console.log(event);
        let propData = nodeId;
        let splitdata = propData?.split("_")[2];
        let projectId = propData?.split("_")[0];
        let roleId = propData?.split("_")[1];

        let fData = competenciesTable(
          splitdata,
          projectId,
          roleId,
          setDataProjectId,
          setFlag,
          setTableData
        );
      };

      return (
        <div
          className={clsx(className, classes.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
          })}
          onMouseDown={handleMouseDown}
          ref={ref}
        >
          <div onClick={handleExpansionClick} className={classes.iconContainer}>
            {icon}
          </div>
          <Typography
            onClick={handleSelectionClick}
            component="div"
            // className={classes.label}
          >
            {label}
          </Typography>
        </div>
      );
    });

    const StyledTreeItem = styled((props) => (
      <div className="hierarchy tree">
        <TreeItem
          ContentComponent={CustomContent} // expanding only when click on plus icon
          {...props}
          key={String(props.node.id)}
          nodeId={String(props.node.id)}
          label={
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
              <Box color="inherit" sx={{ mr: 1 }} />

              <Typography
                variant="body2"
                sx={{ fontWeight: "inherit", flexGrow: 1 }}
              >
                <span
                  style={{
                    color: props.node.text.includes("span")
                      ? props.node.text.split('"')[1].split(":")[1]
                      : "",
                    fontWeight: props.node.parent.includes("#") ? "bold" : "",
                  }}
                >
                  <span
                    style={{
                      fontWeight: props.node.text.includes("b") ? "bold" : "",
                    }}
                  >
                    {" "}
                    {props.node.text.includes("span")
                      ? props.node.text
                          .split('">')[1]
                          .split("(")[0]
                          .replaceAll("<b>", "")
                          .replaceAll("</b>", "")
                      : props.node.text
                          .split("(")[0]
                          .replaceAll("<b>", "")
                          .replaceAll("</b>", "")}
                    {}
                  </span>
                  <span>
                    {" "}
                    {props.node.text.split("(")[1] != undefined
                      ? props.node.text.split("(")[1].includes("span")
                        ? "(" +
                          props.node.text
                            .split("(")[1]
                            .replaceAll("</span>", "")
                        : "(" + props.node.text.split("(")[1]
                      : ""}
                  </span>
                </span>
              </Typography>
            </Box>
          }
          TransitionComponent={TransitionComponent}
          title={
            props.node.text.split("(")[1] != undefined &&
            props.node.text.split("(")[1].includes("span")
              ? ""
              : "From Date    : " +
                formattedFromDate +
                "\n" +
                "To Date         : " +
                formattedToDate
          }
        >
          {Array.isArray(props.node.subrows)
            ? props.node.subrows.map((node) => renderTree(node))
            : ""}
        </TreeItem>
      </div>
    ))(({ theme }) => ({
      [`& .${treeItemClasses.iconContainer}`]: {
        "& .close": {
          opacity: 0.3,
        },
      },
      [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
      },
    }));

    const temp = (data, projectId, roleId) => {
      setDataProjectId(data + "_" + projectId);
      setFlag(data == undefined ? false : true);

      axios({
        method: "get",
        url:
          baseUrl +
          `/ProjectMS/project/getResCompts?resId=${data}&prjId=${projectId}&roleId=${roleId}`,
      }).then((res) => {
        let criticality = res.data;

        setTableData(criticality);
      });
    };

    const renderTree = (nodes) => (
      <div>
        <StyledTreeItem node={nodes}></StyledTreeItem>
      </div>
    );

    return (
      <div
        style={{ maxHeight: "400px", minHeight: "500px", overflowY: "auto" }}
      >
        <TreeView
          aria-label="rich object"
          defaultExpanded={[defaultExpandedRows]}
          defaultParentIcon={
            <div className="iconContainer">
              <MinusSquare className="hierarchyIcons" />
            </div>
          }
          defaultCollapseIcon={
            <div className="iconContainer">
              <MinusSquare className="hierarchyIcons" />
            </div>
          }
          defaultExpandIcon={
            <div className="iconContainer">
              <PlusSquare className="hierarchyIcons" />
            </div>
          }
          defaultEndIcon={<FaUserAlt className="hierarchyIcons user" />}
          sx={{
            "& .css-1g86id8-MuiTreeItem-content .MuiTreeItem-label": {
              width: "auto",
              minwidth: 0,
            },
          }}
          className="hierarchyTree"
        >
          {renderTree(hierarchy[0])}
        </TreeView>
      </div>
    );
  },

  (prevProps, currentProps) => {
    if (prevProps.hierarchyCount === currentProps.hierarchyCount) {
      return true;
    }

    return false;
  }
);

export default ProjectHierarchyTree;
