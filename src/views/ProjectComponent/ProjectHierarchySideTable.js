import { ColumnGroup } from "primereact/columngroup";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { MdOutlineAdd } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { TfiSave } from "react-icons/tfi";
import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillEdit } from "react-icons/ai";

export default function CompetencyTable(props) {
  const { flag, tableData } = props;
  const baseUrl = environment.baseUrl;

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Competency" alignHeader={"center"} />
        <Column header="Exp Rating" alignHeader={"center"} />
        <Column header="Act Rating" alignHeader={"center"} />
        <Column header="Make a Plan" alignHeader={"center"} />
      </Row>
    </ColumnGroup>
  );
  const handlecompetency = (data) => {
    return (
      <div data-toggle="tooltip" title={data.Competency}>
        {data.Competency}
      </div>
    );
  };
  const handleExpRating = (data) => {
    return (
      <div data-toggle="tooltip" title={data.ExpRating}>
        {data.ExpRating}
      </div>
    );
  };
  const handleActRating = (data) => {
    return (
      <div data-toggle="tooltip" title={data.ActRating}>
        {data.ActRating}
      </div>
    );
  };
  const handleMakeaplan = (data) => {
    return (
      <div data-toggle="tooltip" title={data.Makeaplan}>
        {data.Makeaplan}
      </div>
    );
  };
  return (
    <div className=" darkHeader"> 
      <DataTable    ////customerEngament
        value={tableData}
        showGridlines
        headerColumnGroup={headerGroup}
        pagination
        paginator
        rows={15}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 15, 25, 50]}
        paginationComponentOptions={{
          rowsPerPageText: "Records per page:",
          rangeSeparatorText: "out of",
        }}
      >
        <Column
          field="Competency"
          header="Competency"
          body={handlecompetency}
        />
        <Column field="ExpRating" header="ExpRating" body={handleExpRating} />
        <Column field="ActRating" header="ActRating" body={handleActRating} />
        <Column field="Makeaplan" header="Makeaplan" body={handleMakeaplan} />
      </DataTable>
    </div>
  );
}
