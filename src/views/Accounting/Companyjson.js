export function getCompanyTableData(){
    let tableData=[
        {
            id:'S No.',
            companyName:'Company Name',
            currency:'Currency',
        
        },
        {
            id:1,
            companyName:'Prolifics Us',
            currency:'US Dollar',
            
        },


    ]
    return tableData
}

export function getContractTableData(){
    let tableData=[
        {
            id:'S No.',
            contractTerms:'Contract Terms',
            
        },
        {
            id:1,
            contractTerms:'Prolifics Us',
           
        },


    ]
    return tableData
}

export function getContractEditTableData(){
    let tableData=[
        {
            mapping:'Mapping',
            GlItem:'GL Item / Account No.'
        },
        {
            mapping:'Revenue G/L Account',
            GlItem:'xxxx'
        },


    ]
    return tableData
}

export function getExpenseTableData(){
    let tableData=[
        {
            id:'S No.',
            contractTerms:'Expense Type',
            
        },
        {
            id:1,
            contractTerms:'Prolifics Us',
           
        },


    ]
    return tableData
}

export function getCompanyEditTableData(){
    let tableData=[
        {
            companyName:'Company Name',
            costCenter:'Cost Center',
            GLAccount:' G/LAccount'
        },
        {
            companyName:'Company Name',
            costCenter:'111-00',
            GLAccount:'1862'
        }, 
        {
            companyName:'Company Name',
            costCenter:'111-00',
            GLAccount:'1862'
        }, 
    ]
    return tableData
}
