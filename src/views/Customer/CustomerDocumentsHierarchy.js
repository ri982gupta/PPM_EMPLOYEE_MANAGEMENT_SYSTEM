import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import PropTypes, { node } from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FcOpenedFolder } from "react-icons/fc";
import { useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" className="hierarchyCollapseIcon" {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" className="hierarchyExpandIcon" {...props}>
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

const StyledTreeItem = styled((props) => {
  return (
    <div>
      <TreeItem
        {...props}
        key={String(props?.node?.id)}
        nodeId={String(props?.node?.id)}
        label={
          <Tooltip title={props?.node?.folder_name}>
            <span>{props?.node?.folder_name}</span>
          </Tooltip>
        }
        TransitionComponent={TransitionComponent}
      >
        {Array.isArray(props?.node?.subRows)
          ? props?.node?.subRows.map((node) => renderTree(node))
          : ""}
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
export default function CustomerDocumentsHierarchy(props) {
  const {
    defaultExpandedRows,
    data,
    SetDocFolderId,
    setLabel,
    customerId,
    label,
    setAddVisible,
  } = props;

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementsByClassName("MuiTreeItem-root")[0]
        .children[0].click();
    }, 1000);
  }, []);

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
    flatArray?.forEach((node) => {
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
  const hierarchy = jsonToTree(data);
  const handleSelect = (event, nodeIds) => {
    SetDocFolderId(nodeIds);
    setAddVisible(false);
    setLabel("");
    if (event.target.innerHTML.trim().startsWith("<path")) {
      setLabel("");
    } else {
      setLabel(event.target.innerHTML);
    }
  };

  function setFolderOrder(hierarchy, folderOrder) {
    const filteredHierarchy = hierarchy.filter(
      (item) => item.folder_name !== "SOW"
    );

    filteredHierarchy.sort((a, b) => {
      const aIndex = folderOrder.indexOf(a.folder_name);
      const bIndex = folderOrder.indexOf(b.folder_name);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      }
      return a.folder_name.localeCompare(b.folder_name);
    });

    let filteredHierarch = filteredHierarchy.filter((item) =>
      item.folder_name == customerId ? (item.folder_name = "Expense") : ""
    );
    return filteredHierarchy;
  }

  let filteredHierarchy = setFolderOrder(hierarchy, [
    "IA Support",
    "PPM Development and Implementation",
    "Expense",
    "Expenses",
  ]);

  return (
    <>
      <TreeView
        aria-label="rich object"
        defaultExpanded={[defaultExpandedRows]}
        defaultCollapseIcon={
          <div className="iconContainer">
            <MinusSquare className="hierarchyIcons" />
            <FcOpenedFolder className="hierarchyIcons folder" />
          </div>
        }
        defaultExpandIcon={
          <div className="iconContainer">
            <PlusSquare className="hierarchyIcons" />
            <FcOpenedFolder className="hierarchyIcons folder" />
          </div>
        }
        defaultEndIcon={<FcOpenedFolder className="hierarchyIcons folder" />}
        defaultParentIcon={<FcOpenedFolder className="hierarchyIcons folder" />}
        className="hierarchyTree"
        onNodeSelect={handleSelect}
      >
        {filteredHierarchy.map((item) => renderTree(item))}
      </TreeView>
    </>
  );
}
