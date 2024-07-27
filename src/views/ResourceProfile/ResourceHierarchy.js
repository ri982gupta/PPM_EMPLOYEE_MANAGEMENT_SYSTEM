import React, { useState } from "react";
import Tree from "react-animated-tree-v2";

function ResourceHierarchy({ displayHierarchyHead }) {

  const [loader, setLoader] = useState(false)

  const treeStyles = {

    color: "black",
    fill: "black",

  };

  const typeStyles = {
    fontSize: "2em",
    verticalAlign: "middle",
  };
  const handletree = (data) => {

    console.log("data", data, typeof data);

    onSubmit(data);
  };
  // const DisplayTree = () => {
  //   let content = []
  //   for (let item of displayHierarchyHead) {
  //     content.push(item)
  //     console.log(item, "---item")
  //   }
  //   return content;
  console.log(displayHierarchyHead, "--- hierrachy")
  console.log(displayHierarchyHead?.length, "---length")
  // }
  return (
    <div className="group mb-3 customCard">

      {/* {
        displayHierarchyHead.map((ele) => { */}

      <div className="group mb-3 customCard">
        {/* <h2>Resources</h2> */}
        <div className="group-content row">
          <Tree
            content={displayHierarchyHead[0]?.text}
            canHide
            open
            // data-toggle="tooltip" title={displayHierarchyHead[0]?.text}
            style={treeStyles}
            onClick={() => handletree(displayHierarchyHead[0]?.text)}
          >
            {displayHierarchyHead?.length > 1 && <Tree content={displayHierarchyHead[1]?.text}
              canHide
              open
              style={treeStyles}
              onClick={() => handletree(displayHierarchyHead[1]?.text)}>
              {displayHierarchyHead?.length > 2 && <Tree content={displayHierarchyHead[2]?.text}
                canHide
                open
                style={treeStyles}

                onClick={() => handletree(displayHierarchyHead[2]?.text)}>
                {displayHierarchyHead?.length > 3 && <Tree content={displayHierarchyHead[3]?.text}
                  canHide
                  open
                  style={treeStyles}

                  onClick={() => handletree(displayHierarchyHead[3]?.text)}>
                  {displayHierarchyHead?.length > 4 && <Tree content={displayHierarchyHead[4]?.text}
                    canHide
                    open
                    style={treeStyles}

                    onClick={() => handletree(displayHierarchyHead[4]?.text)}>
                  </Tree>}
                </Tree>}
              </Tree>}
            </Tree>}

          </Tree>
        </div>
      </div>

      {/* })
      } */}
    </div>
  )
}

export default ResourceHierarchy;
