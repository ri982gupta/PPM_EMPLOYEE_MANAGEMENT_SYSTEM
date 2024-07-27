import Tree from "react-animated-tree-v2";
import DynamicTree from "react-dynamic-animated-tree";

import React, { Component } from 'react'

function Tree() {
  return (
    <div>
      <DynamicTree />
    </div>
  )
}

export default Tree


// var data = [
//     {
//       title: "Sri Lanka",
//       id: "1",
//       childNodes: [
//         {
//           title: "Western Province",
//           id: "11",
//           childNodes: [
//             {
//               title: "Colombo District",
//               id: "111",
//               childNodes: []
//             }
//           ]
//         },
//         {
//           title: "Central Province",
//           id: "12",
//           childNodes: [
//             {
//               parentNode: null,
//               childNodes: [],
//               title: "Kandy",
//               id: "121"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       title: "India",
//       id: "2",
//       childNodes: [
//         {
//           title: "Maharashtra",
//           id: "21",
//           childNodes: [
//             {
//               title: "Pune",
//               id: "211",
//               childNodes: []
//             }
//           ]
//         }
//       ]
//     }
//   ];