import React, { useState, useEffect } from "react";
import { getTableData } from "./RoleCostsData";
import { DataTable } from "primereact/datatable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "primeflex/primeflex.scss";
import "primeicons/primeicons.css";
import RoleCostInternalDataTable from "./RoleCostInternalDataTable";
function RoleCostsDataTable() {
  const [Data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [roletype, setRoletype] = useState();
  useEffect(() => {
    setData(getTableData());
  }, []);
  const DialogHeaderTemplate = () => {
    return <p>Cost History of {roletype} for India</p>;
  };
  let ButtonFunction = (name) => {
    setVisible(true);
    setRoletype(name);
  };

  const ButtonBodyTemplate = (rowData) => {
    return (
      <div>
        <span>{rowData.roletype}</span>
        <Button
          icon="pi pi-history"
          onClick={() => ButtonFunction(rowData.roletype)}
          style={{ width: "10px", height: "0.5px", margin: "2px" }}
        />
      </div>
    );
  };

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Role Type" rowSpan={2} className="text-center" />
        <Column header="Cadre" rowSpan={2} />
        <Column
          header="AI & Advanced Analytics"
          colSpan={5}
          headerStyle={{ textAlign: "center" }}
        />
        <Column header="Cybersecurity" colSpan={5} />
        <Column header="Digital Experience & App Dev" colSpan={5} />
        <Column header="Enterprise Architecture" colSpan={5} />
        <Column header="Information Management & Data Governance" colSpan={5} />
        <Column header="Integration and Platforms" colSpan={5} />
        <Column header="Intelligent Business Automation" colSpan={5} />
        <Column header="Internal Automation" colSpan={5} />
        <Column header="Master Data Management" colSpan={5} />
        <Column header="Prolifics Products" colSpan={5} />
        <Column header="Quality Enginnering" colSpan={5} />
        <Column header="Service Excellence" colSpan={5} />
        <Column header="Tire2" colSpan={5} />
      </Row>
      <Row>
        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />

        <Column header="Recent Cost" />
        <Column header="Previous Cost" />
        <Column header="Variance" />
        <Column header="Computed Cost" />
        <Column header="Bill Rate" />
      </Row>
    </ColumnGroup>
  );
  return (
    <React.Fragment>
      <DataTable
        value={Data}
        showGridlines
        headerColumnGroup={headerGroup}
        resizableColumns="true"
      >
        <Column field="roletype" body={ButtonBodyTemplate}></Column>
        <Column field="cadre" />
        <Column field="AAA.recentCost" />
        <Column field="AAA.previousCost" />
        <Column field="AAA.variance" />
        <Column field="AAA.computedCost" />
        <Column field="AAA.billRate" />

        <Column field="CyberSecurity.recentCost" />
        <Column field="CyberSecurity.previousCost" />
        <Column field="CyberSecurity.variance" />
        <Column field="CyberSecurity.computedCost" />
        <Column field="CyberSecurity.billRate" />

        <Column field="DEAD.recentCost" />
        <Column field="DEAD.previousCost" />
        <Column field="DEAD.variance" />
        <Column field="DEAD.computedCost" />
        <Column field="DEAD.billRate" />

        <Column field="EA.recentCost" />
        <Column field="EA.previousCost" />
        <Column field="EA.variance" />
        <Column field="EA.computedCost" />
        <Column field="EA.billRate" />

        <Column field="IMDG.recentCost" />
        <Column field="IMDG.previousCost" />
        <Column field="IMDG.variance" />
        <Column field="IMDG.computedCost" />
        <Column field="IMDG.billRate" />

        <Column field="IP.recentCost" />
        <Column field="IP.previousCost" />
        <Column field="IP.variance" />
        <Column field="IP.computedCost" />
        <Column field="IP.billRate" />

        <Column field="IBA.recentCost" />
        <Column field="IBA.previousCost" />
        <Column field="IBA.variance" />
        <Column field="IBA.computedCost" />
        <Column field="IBA.billRate" />

        <Column field="IA.recentCost" />
        <Column field="IA.previousCost" />
        <Column field="IA.variance" />
        <Column field="IA.computedCost" />
        <Column field="IA.billRate" />

        <Column field="MDM.recentCost" />
        <Column field="MDM.previousCost" />
        <Column field="MDM.variance" />
        <Column field="MDM.computedCost" />
        <Column field="MDM.billRate" />

        <Column field="PP.recentCost" />
        <Column field="PP.previousCost" />
        <Column field="PP.variance" />
        <Column field="PP.computedCost" />
        <Column field="PP.billRate" />

        <Column field="QE.recentCost" />
        <Column field="QE.previousCost" />
        <Column field="QE.variance" />
        <Column field="QE.computedCost" />
        <Column field="QE.billRate" />

        <Column field="SE.recentCost" />
        <Column field="SE.previousCost" />
        <Column field="SE.variance" />
        <Column field="SE.computedCost" />
        <Column field="SE.billRate" />

        <Column field="Tier2.recentCost" />
        <Column field="Tier2.previousCost" />
        <Column field="Tier2.variance" />
        <Column field="Tier2.computedCost" />
        <Column field="Tier2.billRate" />
      </DataTable>

      <Dialog
        header={DialogHeaderTemplate}
        visible={visible}
        style={{ width: "90vw" }}
        onHide={() => setVisible(false)}
      >
        <div>
          <RoleCostInternalDataTable />
        </div>
      </Dialog>
    </React.Fragment>
  );
}

export default RoleCostsDataTable;
