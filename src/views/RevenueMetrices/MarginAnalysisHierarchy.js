import React, { useState, useEffect } from "react";
import TreeView from "@mui/lab/TreeView";
import PropTypes, { node } from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import "../ProjectComponent/DocumentHierarchy.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { BiLoaderCircle } from "react-icons/bi";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
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
export default function MarginAnalysisHierarchy(props) {
  const baseUrl = environment.baseUrl;
  const {
    defaultExpandedRows,
    validation,
    popDocFolderId,
    setNodeClicked,
    setResName,
  } = props;
  {
    /*--------------------Hierarchy Data--------------------- */
  }
  const [data, setData] = useState([]);
  const [ac, setAc] = useState([]);
  const [loading, setLoading] = useState(false);
  const getHierarchyData = () => {
    setLoading(true);
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
        console.log(newData);
        setAc(newData);

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
        setLoading(false);
        setData(filteredData);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getHierarchyData();
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
  const handleSelect = (events, nodeIds) => {
    console.log("Clicked??", events);

    const resName = ac
      .filter((item) => {
        return item.id === parseInt(nodeIds);
      })
      .map((item) => {
        return item.name;
      });
    setNodeClicked(nodeIds);
    setResName(resName);
  };

  function setFolderOrder(hierarchy, folderOrder) {
    const filteredHierarchy = hierarchy.filter(
      (item) => item.full_name !== "SOW"
    );

    return filteredHierarchy;
  }
  let filteredHierarchy = setFolderOrder(hierarchy, [
    "IA Support",
    "PPM Development and Implementation",
    "Expense",
    "Expenses",
  ]);

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  return (
    <div>
      {validation ? (
        <div className="statusMsg error mb-2">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12 mb-2">
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
                  console.log("??????");
                  setNodeClicked(e.id);
                  const resName = ac
                    .filter((item) => {
                      return item.id === parseInt(e.id);
                    })
                    .map((item) => {
                      return item.name;
                    });
                  setResName(resName);
                }}
                showIcon={false}
                placeholder="Type minimum 3 characters"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <>
          <BiLoaderCircle /> Loading...
        </>
      ) : (
        <div
          style={{ minHeight: "50px", maxHeight: "300px", overflowY: "auto" }}
        >
          <TreeView
            aria-label="customized"
            defaultExpanded={[defaultExpandedRows]}
            defaultCollapseIcon={
              <div style={iconStyle}>
                <MinusSquare />
                <span> </span>
                <FcOpenedFolder />{" "}
              </div>
            }
            defaultExpandIcon={
              <div style={iconStyle}>
                <PlusSquare />
                <span> </span>
                <FcOpenedFolder />{" "}
              </div>
            }
            defaultEndIcon={<FcOpenedFolder />}
            defaultParentIcon={<FcOpenedFolder />}
            sx={{
              "& .css-1g86id8-MuiTreeItem-content .MuiTreeItem-label": {
                width: "auto",
                minwidth: 0,
              },
            }}
            className="hierarchyTree"
            onNodeSelect={handleSelect}
          >
            {filteredHierarchy.map((item) => renderTree(item))}
          </TreeView>
        </div>
      )}
    </div>
  );
}
