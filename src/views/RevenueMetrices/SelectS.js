import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import InDirectSE from "./InDirectS"
import SelectedItems from "./SelectedItems"
// import VirtualTeams from "./VirtualTeams"
// import DirectSE from "./DirectSE"
import fte_active from '../../assets/images/empstatusIcon/fte_active.png'
import fte_inactive from '../../assets/images/empstatusIcon/fte_inactive.png'
import fte_notice from '../../assets/images/empstatusIcon/fte_notice.png'
import subk_active from '../../assets/images/empstatusIcon/subk_active.png'
import subk_inactive from '../../assets/images/empstatusIcon/subk_inactive.png'
import subk_notice from '../../assets/images/empstatusIcon/subk_notice.png'
import { environment } from '../../environments/environment';
import axios from "axios"
import './SelectedSE.scss'

const SelectSE = forwardRef((props, ref) => {
    const baseUrl = environment.baseUrl;
    const [showInactive, setShowInactive] = useState(false)
    const [selectedSE, setselectedSE] = useState([]);
    const [selectedSEDisp, setselectedSEDisp] = useState([])
    const [allIndirectSelected, setallIndirectSelected] = useState(false)
    const [indirectData, setIndirectdata] = useState([])
    const [isIndividual, setisIndividual] = useState(false)
    const [search, setSearch] = useState("")

    // const icons = {
    //     fte0:<img src={fte_inactive} alt='(fte_inactive_icon)' style={{height:'12px'}} title='Ex-Employee'/>,
    //     fte1:<img src={fte_active} alt='(fte_active_icon)' style={{height:'12px'}} title='Active Employee'/>,
    //     fte2:<img src={fte_notice} alt='(fte_notice_icon)' style={{height:'12px'}} title='Employee in notice period'/>,
    //     subk0:<img src={subk_inactive} alt='(subk_inactive_icon)' style={{height:'12px'}} title='Ex-Contractor'/>,
    //     subk1:<img src={subk_active} alt='(subk_active_icon)' style={{height:'12px'}} title='Active Contractor'/>,
    //     subk2:<img src={subk_notice} alt='(subk_notice_icon)' style={{height:'12px'}} title='Contractor in notice period'/>,
    // }

    //---------------------------refMethod------------------------------------

    useImperativeHandle(ref, () => ({
        setGlobalState() {
            localStorage.setItem('selectedSE', JSON.stringify(selectedSE));
            localStorage.setItem('isIndividual', isIndividual)
        },
        resetTOlocalState() {
            const localSE = (localStorage.getItem('selectedSE')) === null ? [] : JSON.parse(localStorage.getItem('selectedSE'))
            setselectedSE(localSE);
            setisIndividual(localStorage.getItem('isIndividual') === "true" ? true : false);
        }
    }));

    // //---------------------------method------------------------------------------
    const onSelectSE = (emp) => {
        setselectedSE(prevState => { return prevState.some(el => el.id === emp.id) ? prevState.filter((item) => { return item.id !== emp.id }) : [...prevState, emp] })
    }

    const employeeElement = (emp) => {
        return (
            <span key={emp.id} className="option col-md-12" style={{ width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <input type="checkbox" id={emp.id} name={emp.salesPersonName} onChange={(e) => onSelectSE(emp)} checked={selectedSE.some(el => el.id === emp.id)}></input>&nbsp;

                &nbsp;
                <span title={emp.salesPersonName}  >{emp.salesPersonName}</span>
            </span>
        )
    }

    const selectAllIndirect = () => {
        !allIndirectSelected ?
            setselectedSE(prevState => {
                const empId = prevState.map(item => item.id)
                const newArray = indirectData.filter((item => item.status !== (showInactive ? "" : "empInactive"))).filter(item => !(empId.includes(item.id)))
                return [...prevState, ...newArray]
            }) :
            setselectedSE(prevState => {
                const empId = indirectData.map(item => item.id)
                const newArray = prevState.filter(item => !(empId.includes(item.id)))
                return newArray
            })
        setallIndirectSelected(prevState => !prevState)
    }

    const getIndirectData = () => {
        axios.get(baseUrl + `/SalesMS/MasterController/getInDirectSalesExecutiveTreeData?userId=512`)
            .then((resp) => {
                const data = resp.data;
                setIndirectdata(data);
            })
            .catch((resp) => {
                console.log(resp)
            })
    }


    // //--------------------------------useEffect------------------------------------------
    useEffect(() => {
        setselectedSEDisp(() => {
            return selectedSE.filter((item) => { return item.salesPersonName.toLowerCase().includes(search) }).map((item) => { return (employeeElement(item)) })
        })
    }, [selectedSE, search])

    useEffect(() => {
        setselectedSE((prevState) => { return prevState.filter(el => el.status === "empActive") })
    }, [showInactive])

    useEffect(() => {
        getIndirectData();
        const localSE = (localStorage.getItem('selectedSE')) === null ? [] : JSON.parse(localStorage.getItem('selectedSE'))
        setselectedSE(localSE);
        setisIndividual(localStorage.getItem('isIndividual') === "true" ? true : false);
    }, [])

    return (
        <div className="col-md-12">

            <div className="col-md-12">
                <div className="col-md-3 nopadding">
                    <input type="text" placeholder=" Type to Search" onChange={(e) => setSearch(e.target.value.toLowerCase())} style={{ borderRadius: "5px" }}></input>
                </div>


            </div>
            <div className="col-md-12 clearfix" style={{ height: '10px' }}></div>
            <div className="col-md-3">
                <label >Selected Items</label>&nbsp;
                <input type="checkbox" id="SelectedItems" name="SelectedItems" onChange={() => { setselectedSE([]) }} checked={selectedSE.length > 0}></input>&nbsp;
            </div>
            <div className="col-md-12">
                <SelectedItems selectedSEDisp={selectedSEDisp} />
            </div>
            <div className="col-md-12 clearfix" style={{ height: '10px' }}></div>

            <div className="col-md-12 nopadding">

                {/* <div className="col-md-3 pr0">
                <div className="col-md-12 customCard">
                    <DirectSE onSelectSE={onSelectSE} showInactive={showInactive}/>
                </div>
                
            </div> */}

                <div className="col-md-12">

                    <div className="col-md-12 customCard">
                        <div className="col-md-6">
                            <label >All Customers</label>&nbsp;
                            <input type="checkbox" onChange={selectAllIndirect} checked={allIndirectSelected}></input>
                        </div>
                        <div className="col-md-12 clearfix" style={{ height: '20px' }}></div>
                        <InDirectSE employeeElement={employeeElement} selectedSE={selectedSE} data={indirectData} showInactive={showInactive} search={search} />
                    </div>

                </div>

            </div>

        </div>)
})

export default SelectSE;