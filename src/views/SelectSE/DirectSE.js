import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem, { treeItemClasses, useTreeItem } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { alpha, styled } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { signal } from "@preact/signals";
import { animated, useSpring } from "@react-spring/web";
import axios from "axios";
import clsx from "clsx";
import { color } from "highcharts";
import PropTypes from "prop-types";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  FaPlusSquare,
  FaUserAlt,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { environment } from "../../environments/environment";
import { updatedirectSETreeData } from "../../reducers/SelectedSEReducer";

function MinusSquare(props) {
  return (
    <SvgIcon
      className="hierarchyCollapseIcon"
      fontSize="inherit"
      style={{ width: 12, height: 12 }}
      {...props}
    >
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 12, height: 12 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon
      className="hierarchyExpandIcon"
      fontSize="inherit"
      style={{ width: 12, height: 12 }}
      {...props}
    >
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
  in: PropTypes.bool,
};
export default function DirectSE({
  onSelectSE,
  setGrpId,
  accessData,
  dataAccess,
  salesfullAccess,
}) {
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Ex-Employee"
      />
    ),

    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Active Employee"
      />
    ),

    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Employee in notice period"
      />
    ),

    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Ex-Contractor"
      />
    ),

    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Active Contractor"
      />
    ),

    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Contractor in notice period"
      />
    ),
  };
  console.log(dataAccess);
  const [hierarchy, setHierarchy] = useState(null);
  const isShowInactiveChecked = useSelector(
    (state) => state.selectedSEState.isShowInactiveChecked
  );
  const isIndividualChecked = useSelector(
    (state) => state.selectedSEState.isIndividualChecked
  );
  const baseUrl = environment.baseUrl;
  const [data, setData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState(null);
  const [select, setSelect] = useState({});
  const [salesSEData, setSalesSEData] = useState([]);
  const localSEData = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );
  const idsWithoutDirectSalesEx = localSEData.map((item) => item.id);
  const idDirectSalesEx = localSEData
    .filter((item) => item.key === "directsalesEx")
    .map((item) => item.id);
  const filteredArray = isShowInactiveChecked
    ? salesSEData
    : salesSEData?.filter((item) => item.status !== "empInactive");
  const idToFind = idDirectSalesEx[0];
  const initialExpandedIds = ["id"];
  const [parentObjInHierarchy, setParentObjInHierarchy] = useState();

  const jsonToTree = (flatArray, options, id) => {
    setSalesSEData(flatArray);
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
  useEffect(() => {
    if (filteredData) {
      const updatedHierarchy = jsonToTree(filteredData);
      if (updatedHierarchy.length > 1) {
        const find = updatedHierarchy.find((obj) => obj.parent == "#");
        find ? setParentObjInHierarchy(find) : "";
      } else setParentObjInHierarchy(updatedHierarchy[0]);
      setHierarchy(updatedHierarchy);
    }
  }, [filteredData]);

  // ==============Use Effects start ====================
  useEffect(() => {
    // Filter out items where type is "fte0" or "subk0"
    if (data) {
      isShowInactiveChecked
        ? setFilteredData(data)
        : setFilteredData(
            data.filter((obj) => obj.type !== "fte0" && obj.type !== "subk0")
          );
    }
  }, [isShowInactiveChecked, data]);

  useEffect(() => {
    getData();
  }, []);
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
      handleSelection(event);
      let propData = nodeId;
      let splitdata = propData?.split("_")[2];
      let projectId = propData?.split("_")[0];
      let roleId = propData?.split("_")[1];
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

  // ==================Use Effect end================

  //===================Function calls start ===============
  //check if the selected person has children
  //If children present, add id into array then again check for children- recursion/loop
  const findChildrenAndDescendants = (data, parentId) => {
    const result = [];

    function findChildren(parentId) {
      for (const item of data) {
        if (item.parent === parentId) {
          result.push(item.id);
          findChildren(item.id);
        }
      }
    }
    findChildren(parentId);
    return result;
  };

  const idsListToBeSent = findChildrenAndDescendants(filteredArray, idToFind);
  const idsToSend = isIndividualChecked
    ? [idToFind, ...idsWithoutDirectSalesEx]
    : [...idsListToBeSent, ...idsWithoutDirectSalesEx, idToFind];
  const formattedIds = idsToSend.join(",");

  useEffect(() => {
    dispatch(updatedirectSETreeData(formattedIds));
  }, [formattedIds]);

  function getidList(tree) {
    let ids = [];
    tree.map((val) => {
      ids.push(val.id);
      if (val.subrows.length > 0) {
        let x = getidList(val.subrows);
        ids.push(...x);
      }
    });
    return ids;
  }
  function getTree(id) {
    return hierarchy[0].subrows.filter((val) => val.id == id);
  }
  let a1 = document.getElementsByClassName("iconContainer");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const hasChildren = (nodeId) => {
    const isParent = filteredData.find((obj) => obj.parent == nodeId);
    return isParent ? true : false;
  };

  const StyledTreeItem = styled((props) => (
    <div className="hierarchy tree">
      <TreeItem
        ContentComponent={CustomContent} // expanding only when click on plus icon
        {...props}
        key={String(props.node?.id)}
        nodeId={String(props.node?.id)}
        onClick={(e) => {
          let temp = getidList(getTree(props.node?.id));
          setGrpId(temp);
        }}
        icon={!hasChildren(props.node?.id) ? <CloseSquare /> : ""}
        label={
          <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
            <Box color="inherit">
              {props.node?.type == "Department" ? (
                <FaUsers />
              ) : (
                icons[props.node?.type]
              )}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
              <span
                style={{
                  color: props.node?.text.includes("span")
                    ? props.node.text.split('"')[1].split(":")[1]
                    : "",
                }}
              >
                <span>
                  {" "}
                  {props.node?.text.includes("span")
                    ? props.node?.text
                        .split('">')[1]
                        .split("(")[0]
                        .replaceAll("<b>", "")
                        .replaceAll("</b>", "")
                    : props.node?.text
                        .split("(")[0]
                        .replaceAll("<b>", "")
                        .replaceAll("</b>", "")}
                  {}
                </span>
                <span>
                  {" "}
                  {props.node?.text.split("(")[1] != undefined
                    ? props.node?.text.split("(")[1].includes("span")
                      ? "(" +
                        props.node?.text.split("(")[1].replaceAll("</span>", "")
                      : "(" + props.node?.text.split("(")[1]
                    : ""}
                </span>
              </span>
            </Typography>
          </Box>
        }
        TransitionComponent={TransitionComponent}
      >
        {Array.isArray(props.node?.subrows)
          ? props.node?.subrows.map((node) => renderTree(node))
          : console.log("coming here?")}
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

  const renderTree = (node) => {
    return (
      <div>
        <StyledTreeItem node={node}></StyledTreeItem>
      </div>
    );
  };

  const getData = () => {
    axios
      .get(
        accessData == 1000 ||
          accessData == 500 ||
          loggedUserId == 114598021 ||
          salesfullAccess == 920
          ? baseUrl +
              `/CommonMS/master/getDirectSe?loggedUserId=${loggedUserId}&activeId=1`
          : dataAccess == 690 ||
            dataAccess == 641 ||
            dataAccess == 600 ||
            accessData == 100 ||
            dataAccess == 909
          ? baseUrl +
            `/ProjectMS/project/getdirectHirarchyBasis?loggedUserId=${1}`
          : baseUrl +
            `/ProjectMS/project/getdirectHirarchyBasis?loggedUserId=${loggedUserId}`
      )

      .then((resp) => {
        const arrayOfDirectSEs = resp.data;
        const modifiedArray = arrayOfDirectSEs.map((obj) => {
          try {
            // Parse the li_attr string as JSON
            const liAttr = JSON.parse(obj.li_attr);

            // Rename the property from "sestatus" to "status"
            if (liAttr.sestatus !== undefined) {
              obj.status = liAttr.sestatus;
            }

            // Stringify the modified li_attr object and assign it back to the object
            obj.li_attr = JSON.stringify(liAttr);
            obj.key = "directsalesEx";

            return obj; // Return the modified object
          } catch (error) {
            console.error(`Error processing object: ${error}`);
            return obj; // Return the original object in case of an error
          }
        });
        setData(modifiedArray);
      })

      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (event, nodeIds) => {
    let dttt = [...data];
    // let filterData = dttt.filter((d) => d.id == nodeIds);
    const empObject = dttt.find((obj) => obj.id === nodeIds);
    empObject ? onSelectSE(empObject, event) : "";
    const selected = [];
    const findSelectedIds = (dttt, parentId) => {
      dttt.forEach((item) => {
        if (item.parent === parentId) {
          selected.push(item.id);
          setsel(data, item.id);
        }
      });
    };
  };

  const selectDirect = (e) => {
    const value = e;

    const emp = data.find((e) => {
      e.id = value;
    });

    const obj = {
      type: emp.type,
      salesPersonName: emp.text,
      id: emp.id,
      status: JSON.parse(emp.li_attr),
    };
    onSelectSE(obj);
  };

  //===================Function calls end ===============

  return (
    <div>
      <TreeView
        aria-label="rich object"
        ContentComponent={CustomContent}
        onNodeSelect={handleChange}
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
        defaultEndIcon={
          <div className="iconContainer">
            <PlusSquare className="hierarchyIcons" />
          </div>
        }
        sx={{
          "& .css-1g86id8-MuiTreeItem-content .MuiTreeItem-label": {
            width: "auto",
            minwidth: 0,
          },
        }}
        className="hierarchyTree"
        defaultExpanded={initialExpandedIds}
      >
        {hierarchy && renderTree(parentObjInHierarchy)}
      </TreeView>
    </div>
  );
}
