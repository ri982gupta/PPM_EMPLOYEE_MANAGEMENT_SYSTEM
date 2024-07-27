import React,{useStat} from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

function RoleCostInternalDataTable() {
  return (
    <React.Fragment>
        <div className='row'>
            <div className='col-3'>
                <span><b>AI & Advanced Analytics</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Cybersecurity</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Digital Experience & App Dev</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

            <div className='col-3'>
                <span><b>Enterprise Architecture</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

        </div>

        <div className='row'>
            <div className='col-3'>
                <span><b>Information Management & Data Governance</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Integration & Platforms</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Intelligent Business Automation</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

            <div className='col-3'>
                <span><b>Internal Automation</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

        </div>

        <div className='row'>
            <div className='col-3'>
                <span><b>Master Data Management</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Prolifics Products</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>


            <div className='col-3'>
                <span><b>Quality Engineering</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

            <div className='col-3'>
                <span><b>Service Excellence</b></span>
                <DataTable
                    showGridlines
                >
                    <Column field='avgCost' header='Avg Cost/Hr($)'/>
                    <Column field='startMonth' header='Start Month'/>
                    <Column field='endMonth' header='End Month'/>
                </DataTable>
            </div>

        </div>

    </React.Fragment>
  )
}

export default RoleCostInternalDataTable