import React, { useState, useEffect, useRef } from "react";
import TreeView from "@mui/lab/TreeView";
import PropTypes, { node } from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../ProjectComponent/DocumentHierarchy.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { BiLoaderCircle } from "react-icons/bi";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import { Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Loader from "../Loader/Loader";

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

const StyledTreeItem = styled((props) => {
  return (
    <div>
      <TreeItem
        {...props}
        key={String(props?.node?.id)}
        nodeId={String(props?.node?.id)}
        label={props?.node?.full_name}
        TransitionComponent={TransitionComponent}
      >
        {Array.isArray(props?.node?.subRows)
          ? props?.node?.subRows.map((node) => renderTree(node))
          : console.log("coming here?")}
      </TreeItem>
    </div>
  );
})(({ theme }) => ({
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

const renderTree = (nodes) => (
  <div key={String(nodes?.id)}>
    <StyledTreeItem node={nodes}></StyledTreeItem>
  </div>
);
export default function AdminHierarchy(props) {
  const baseUrl = environment.baseUrl;
  const { popDocFolderId } = props;
  const [ac, setAc] = useState([]);

  {
    /*--------------------Hierarchy Data--------------------- */
  }
  const loggedUserId = localStorage.getItem("resId");
  const resourceId = parseInt(loggedUserId) + 1;
  const [searchHierarchy, setSearchHierarchy] = useState(resourceId);
  const loggerUserName = localStorage.getItem("resName");
  const [hierarchyname, setHierarchyname] = useState(loggerUserName);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getHierarchyData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    axios({
      method: "get",
      url: baseUrl + "/revenuemetricsms/RevenueMarginAnalysis/getReportees2",
    })
      .then(function (response) {
        const resp = response.data;
        const newData = resp.map((item) => ({
          name: item.full_name,
          id: item.id,
        }));
        setAc(newData);
         setLoader(false);
        clearTimeout(loaderTime);

        const filteredData = resp.filter((item) => {
          if (item.parent_id !== null) {
            return resp.some(
              (parentItem) =>
                parentItem &&
                parentItem !== "null" &&
                parentItem.id === item.parent_id
            );
          } else {
            return true;
          }
        });
        setData(filteredData);
      })
      .catch((err) => {});
  };
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  useEffect(() => {
    getHierarchyData();
  }, []);
  console.log(ac);
  const jsonToTree = (flatArray, options) => {
    options = {
      id: "id",
      parentId: "parent_id",
      children: "subRows",
      ...options,
    };
    const dictionary = {};
    const tree = [];
    const children = options.children;
    flatArray.forEach((node) => {
      const nodeId = node[options.id];
      const nodeParentId = node[options.parentId];
      dictionary[nodeId] = {
        [children]: [],
        ...node,
        ...dictionary[nodeId],
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
      dictionary[nodeParentId][children].push(dictionary[nodeId]);
    });
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  useEffect(() => {}, [popDocFolderId]);

  const hierarchy = jsonToTree(data);

  const generateTree = (data) => {
    return data.map((person) => (
      <TreeItem
        key={person.id}
        nodeId={String(person.id)}
        label={<Typography>{person.full_name}</Typography>}
      >
        {person.has_childs === 1 &&
        person.children &&
        person.children.length > 0
          ? generateTree(person.children)
          : null}
      </TreeItem>
    ));
  };

  const collectedParentIds = [];
  const reversedIds = [];
  const [expanded, setExpanded] = useState(reversedIds);
  console.log(expanded);
  const handleExpandClick = (idsToExpand) => {
    setExpanded((oldExpanded) => {
      let newExpanded = [...oldExpanded];
      idsToExpand.forEach((parentId) => {
        if (!newExpanded.includes(parentId)) {
          newExpanded.push(parentId);
        }
      });
      return newExpanded;
    });
  };
  const TreeNode = ({ full_name, id, subRows }) => {
    return (
      <TreeItem nodeId={id} label={full_name}>
        {subRows.map((child) => (
          <TreeNode key={child.id} label={child.full_name} />
        ))}
      </TreeItem>
    );
  };
  const [expandedSatyanarayana, setExpandedSatyanarayana] =
    useState(reversedIds);
  console.log(expandedSatyanarayana);
  const [expandedSupervisorOrphans, setExpandedSupervisorOrphans] =
    useState(reversedIds);

  const supervisorOrphansNode = hierarchy.find(
    (item) => item.full_name === "Supervisor Orphans"
  );
  const SatyanarayanaNode = hierarchy.find(
    (item) => item.full_name === "Satyanarayana Bolli"
  );
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  useEffect(() => {
    if (selectedNodeId) {
      const selectedElement = document.querySelector(
        `[data-id="${selectedNodeId}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedNodeId]);
  const renderTree = (node) => (
    <TreeItem
      nodeId={node.id.toString()}
      label={
        <Typography
          style={{
            color: hierarchyname === node.full_name ? "maroon" : "inherit",
            fontWeight: hierarchyname === node.full_name ? "bold" : "normal",
            fontStyle: hierarchyname === node.full_name ? "italic" : "normal",
            fontSize: "13px",
          }}
        >
          {node.full_name}
        </Typography>
      }
      data-id={node.id.toString()}
      ref={(element) => {
        if (element && node.id === selectedNodeId) {
          console.log("Scrolling to node:", node.full_name);
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    >
      {node.has_childs
        ? node.subRows.map((item) => renderTree(item))
        : node.subRows.map((item) => (
            <TreeItem
              key={item.id.toString()}
              nodeId={item.id.toString()}
              label={
                <Typography
                  style={{
                    color:
                      hierarchyname === item.full_name ? "maroon" : "inherit",
                    fontWeight:
                      hierarchyname === item.full_name ? "bold" : "normal",
                    fontStyle:
                      hierarchyname === item.full_name ? "italic" : "normal",
                    fontSize: "13px",
                  }}
                >
                  {item.full_name}
                </Typography>
              }
              data-id={node.id.toString()}
              ref={(element) => {
                if (element && node.id === selectedNodeId) {
                  console.log("Scrolling to node:", node.full_name);
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            />
          ))}
    </TreeItem>
  );
  const findNodeAndCollect = (node, targetId, path = []) => {
    if (node.id === targetId) {
      const parentIds = path.map((parent) => parent.id);
      console.log(parentIds);
      collectedParentIds.push(...parentIds);
    } else if (node.subRows) {
      for (const childNode of node.subRows) {
        findNodeAndCollect(childNode, targetId, [...path, node]);
      }
    }
  };
  for (const rootNode of hierarchy) {
    findNodeAndCollect(rootNode, searchHierarchy);
  }
  useEffect(() => {
    reversedIds.length = 0;
    reversedIds.push(...collectedParentIds.reverse().map(String));
    console.log("Reversed storeParentsId:", reversedIds);
  }, [collectedParentIds]);
  useEffect(() => {
    if (hierarchy.length > 0) {
      const shouldOpenDefault =
        !searchHierarchy || searchHierarchy === resourceId.toString();
      const isCurrentExpandedStateValid =
        (shouldOpenDefault && expanded.includes(resourceId.toString())) ||
        (!shouldOpenDefault && expanded.includes(searchHierarchy));

      if (!isCurrentExpandedStateValid) {
        const nodeIdToExpand = shouldOpenDefault
          ? resourceId.toString()
          : searchHierarchy;
        const parentIds = [];
        findNodeAndCollect(hierarchy, nodeIdToExpand);
        reversedIds.length = 0;
        reversedIds.push(...collectedParentIds.reverse().map(String));
        if (!arraysEqual(expanded, reversedIds)) {
          setExpanded(reversedIds);
        }
        collectedParentIds.length = 0;
      }
    }
  }, [hierarchy, searchHierarchy, expanded]);

  const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  useEffect(() => {
    setExpanded(reversedIds);
  }, []);

  const [isAutomaticExpansionDone, setAutomaticExpansionDone] = useState(false);

  useEffect(() => {
    if (!isAutomaticExpansionDone && expanded.length > 0) {
      handleExpandClick(reversedIds); // Expand the nodes only once
      setAutomaticExpansionDone(true);
    }
  }, [isAutomaticExpansionDone, hierarchy]);

  const handleClick = (event, nodeId) => {
    const reversedCopy = [...reversedIds];
    const nodesToExpand = [nodeId, ...reversedCopy.reverse()]; // Include both parent IDs and the clicked node ID in reverse order
    setExpanded(nodesToExpand);
  };

  return (
    <div>
      <div className="col-md-12 mb-4">
        <div className="form-group row">
          <label className="col-5" htmlFor="email-input">
            Search&nbsp;<span className="error-text ml-1">*</span>
          </label>
          <span className="col-1 p-0">:</span>
          <div className="col-6">
            <div className="autoComplete-container">
              <ReactSearchAutocomplete
                items={ac}
                type="Text"
                name="prjId"
                id="prjId"
                className="error AutoComplete"
                onSelect={(e) => {
                  setSearchHierarchy(e.id);
                  setHierarchyname(e.name);
                  setSelectedNodeId(e.id);
                }}
                showIcon={false}
                inputSearchString={hierarchyname}
                placeholder="Type minimum 3 characters to get the list"
              />
            </div>
          </div>
        </div>
      </div>

      <Box sx={{ flexGrow: 1, maxWidth: 400, overflowY: "hidden" }}>
        <Box sx={{ mb: 1 }}></Box>
        <div
          style={{
            border: "1px solid #ccc",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "5px",
                    verticalAlign: "top",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <TreeView
                    aria-label="controlled"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={
                      expandedSatyanarayana.length === 0 ||
                      expanded.includes(expandedSatyanarayana)
                        ? expanded
                        : expandedSatyanarayana
                    }
                    onNodeToggle={(event, nodeIds) =>
                      setExpandedSatyanarayana(nodeIds)
                    }
                    onNodeSelect={handleClick}
                  >
                    {SatyanarayanaNode ? (
                      renderTree(SatyanarayanaNode)
                    ) : (
                      <p>Satyanarayana Bolli</p>
                    )}
                  </TreeView>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    verticalAlign: "top",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <TreeView
                    aria-label="controlled"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={
                      expandedSupervisorOrphans.length === 0
                        ? expanded
                        : expandedSupervisorOrphans
                    }
                    onNodeToggle={(event, nodeIds) =>
                      setExpandedSupervisorOrphans(nodeIds)
                    }
                    onNodeSelect={handleClick}
                  >
                    {supervisorOrphansNode ? (
                      renderTree(supervisorOrphansNode)
                    ) : (
                      <p>Supervisor Orphans </p>
                    )}
                  </TreeView>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
