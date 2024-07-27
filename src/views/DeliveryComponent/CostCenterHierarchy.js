// import * as React from "react";
// import TreeView from "@mui/lab/TreeView";
// import PropTypes from "prop-types";
// import SvgIcon from "@mui/material/SvgIcon";
// import { alpha, styled } from "@mui/material/styles";
// import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
// import Collapse from "@mui/material/Collapse";
// import { useSpring, animated } from "@react-spring/web";

// function MinusSquare(props) {
//   return (
//     <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
//       <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
//     </SvgIcon>
//   );
// }

// function PlusSquare(props) {
//   return (
//     <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
//       <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
//     </SvgIcon>
//   );
// }

// function TransitionComponent(props) {
//   const style = useSpring({
//     from: {
//       opacity: 0,
//       transform: "translate3d(20px,0,0)",
//     },
//     to: {
//       opacity: props.in ? 1 : 0,
//       transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
//     },
//   });

//   return (
//     <animated.div style={style}>
//       <Collapse {...props} />
//     </animated.div>
//   );
// }

// TransitionComponent.propTypes = {
//   in: PropTypes?.bool,
// };

// const StyledTreeItem = styled((props) => (
//   <div>
//     {console.log(props)}
//     <TreeItem
//       {...props}
//       key={String(props?.node?.id)}
//       nodeId={String(props?.node?.id)}
//       label={props?.node?.cost_center_name}
//       TransitionComponent={TransitionComponent}
//     >
//       {Array.isArray(props?.node?.subRows)
//         ? props?.node?.subRows.map((node) => renderTree(node))
//         : console.log("coming here?")}
//     </TreeItem>
//   </div>
// ))(({ theme }) => ({
//   [`& .${treeItemClasses?.iconContainer}`]: {
//     "& .close": {
//       opacity: 0.3,
//     },
//   },
//   [`& .${treeItemClasses?.group}`]: {
//     marginLeft: 15,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${alpha(theme?.palette?.text.primary, 0.4)}`,
//   },
// }));

// const renderTree = (nodes) => (
//   <div>
//     {console.log(nodes)}
//     <StyledTreeItem node={nodes}></StyledTreeItem>
//   </div>
// );

// export default function CostCenterHierarchy(props) {
//   const { defaultExpandedRows, data } = props;
//   console.log(defaultExpandedRows);
//   const jsonToTree = (flatArray, options) => {
//     options = {
//       id: "id",
//       parentId: "parent_id",
//       children: "subRows",
//       ...options,
//     };
//     const dictionary = {};
//     const tree = [];
//     const children = options.children;
//     flatArray.forEach((node) => {
//       const nodeId = node[options.id];
//       const nodeParentId = node[options.parentId];
//       dictionary[nodeId] = {
//         [children]: [],
//         ...node,
//         ...dictionary[nodeId],
//       };
//       dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
//       dictionary[nodeParentId][children].push(dictionary[nodeId]);
//     });
//     Object.values(dictionary).forEach((obj) => {
//       if (typeof obj[options.id] === "undefined") {
//         tree.push(...obj[children]);
//       }
//     });
//     return tree;
//   };
//   const hierarchy = jsonToTree(data);
//   console.log(data);
//   return (
//     <TreeView
//       aria-label="rich object"
//       defaultExpanded={[defaultExpandedRows]}
//       defaultCollapseIcon={<MinusSquare />}
//       defaultExpandIcon={<PlusSquare />}
//       sx={{
//         "& .css-1g86id8-MuiTreeItem-content .MuiTreeItem-label": {
//           width: "auto",
//           minwidth: 0,
//         },
//       }}
//     >
//       {renderTree(hierarchy[0])}
//     </TreeView>
//   );
// }
