import React, { useState, useEffect } from "react";
import Tree from "react-animated-tree-v2";
import axios from "axios";
import { environment } from "../../environments/environment";

import { memo } from "react";

// import getResourceData from "./ResourceSkillData";

function Resources({ onSubmit, hierarchydata }) {
  const baseUrl = environment.baseUrl;

  const [nodeVal, setNodeVal] = useState("");
  const [nodeData, setNodeData] = useState([]);
  console.log(hierarchydata)
  useEffect(() => {
    // let data = getResourceData();
    // let arrayData = data[0];
    // console.log("dataA", arrayData);
    // console.log("inresource", data);
    // console.log("inresource", data[0]);
    setNodeData(hierarchydata);
  }, []);
  const treeStyles = {
    // position: "absolute",
    // top: 100,
    // left: 40,
    color: "black",
    fill: "black",
    width: "100%",
  };
  // console.log(nodeData, "---- nodeData")

  const typeStyles = {
    fontSize: "2em",
    verticalAlign: "middle",
  };
  const handletree = (data) => {
    console.log("data", data, typeof data);
    let id = data
    console.log(id);

    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getReshierarchy?rid=${id}`,
    })
      .then(function (response) {
        var resp = response.data;
        setNodeData(resp);
        console.log(resp)
      })
    // setNodeVal(data);
    // console.log('i',nodeVal)
    // onSubmit(data);
  };
  return (
    <div className="group mb-3 customCard">
      {/* <h2>Resources</h2> */}
      <div className="group-content row">

        {hierarchydata && hierarchydata.map((ele) => {
          // console.log(hierarchydata)
          return (
            <div className="col-md-12">
              {/* <Tree content={ele.name} type="ITEM" canHide open style={treeStyles}> */}
              <Tree
                content={ele.full_name}
                canHide
                open
                style={treeStyles}
                onClick={() => handletree(ele.id)}
              >
                {ele?.subrows?.map((e) => {
                  return (
                    ele.has_childs == 1 &&
                    <Tree
                      content={e.full_name}
                      canHide
                      type={<span style={typeStyles}></span>}
                      onItemToggle={() => handletree(e.id)}
                    >
                      {e.has_childs == 1
                        ?
                        // e.map((el) => {
                        // { console.log(el.has_childs) }
                        // return (

                        // el.has_childs == 1 &&
                        <Tree
                          // content={el.full_name}
                          canHide
                          style={{ color: "#77eb67" }}
                          onItemToggle={() => handletree(e.id)}
                        />

                        // );

                        // })
                        : ""}
                    </Tree>
                  );
                })}
              </Tree>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Resources);
