
function getResourceData() {
    let data = [
        {

            name: 'Rajeswari Kanupuru',
            title: 'Associate Test Lead',
            supervisor: 'Rajeshwar Rao Akinapelli',
            mobile: 'NA',
            bussinessUnit: 'Internal Automation',
            officialEmail: 'rajeswariKanupuru@prolifics.com',
            officeExtension: 1834,
            skillsDetail: [
                {
                    skillGroup: 'QA',
                    skill: 'manual testing',
                    rating: 4,
                    expirienceM: 12,
                    status: 'Approved',
                    lastUsed: '10-Jan-2019',
                    type: 'Primary'

                },
                {
                    skillGroup: 'QA/QE Automation',
                    skill: 'Selenium Automation Testing',
                    rating: 3,
                    expirienceM: 12,
                    status: 'Approved',
                    lastUsed: '20-Jan-2019',
                    type: 'Secondary'

                },


            ],
            directReportee: [
                {
                    name: 'Achal Kishor Chavan',
                    title: 'Trainee Software Engineer',
                    supervisor: 'Rajeswari Kanupuru',
                    mobile: 'NA',
                    bussinessUnit: 'Internal Automation',
                    officialEmail: 'Achal.Chavan@prolifics.com',
                    officeExtension: 1884,
                    skillsDetail: [
                        {
                            skillGroup: 'QA',
                            skill: 'manual testing',
                            rating: 4,
                            expirienceM: 12,
                            status: 'Approved',
                            lastUsed: '10-Jan-2019',
                            type: 'Primary'

                        },


                    ],
                    directReportee: [
                        {
                            name: 'Amit Chavan',
                            title: 'Trainee Software Engineer',
                            supervisor: 'Achal Kishor Chavan',
                            mobile: 'NA',
                            bussinessUnit: 'Internal Automation',
                            officialEmail: 'Amit.Chavan@prolifics.com',
                            officeExtension: 1894,
                            skillsDetail: [
                                {
                                    skillGroup: 'QA/QE Automation',
                                    skill: 'Selenium Automation Testing',
                                    rating: 3,
                                    expirienceM: 12,
                                    status: 'Approved',
                                    lastUsed: '20-Jan-2019',
                                    type: 'Secondary'

                                },
                            ],

                        }

                    ]
                },
                {
                    name: 'Lakshmi Reddy Mula',
                    title: 'Trainee Software Engineer',
                    supervisor: 'Rajeswari Kanupuru',
                    mobile: 'NA',
                    bussinessUnit: 'Internal Automation',
                    officialEmail: 'Lakshmi.Reddy@prolifics.com',
                    officeExtension: 1784,
                    skillsDetail: [
                        {
                            skillGroup: 'QA/QE Automation',
                            skill: 'Selenium Automation Testing',
                            rating: 3,
                            expirienceM: 12,
                            status: 'Approved',
                            lastUsed: '20-Jan-2019',
                            type: 'Secondary'

                        },


                    ],
                },
                {
                    name: 'Prabhakar Muthyala',
                    title: 'Trainee Software Engineer',
                    supervisor: 'Rajeswari Kanupuru',
                    mobile: 'NA',
                    bussinessUnit: 'Internal Automation',
                    officialEmail: 'Prabhakar.Muthyala@prolifics.com',
                    officeExtension: 1584,
                    skillsDetail: [
                        {
                            skillGroup: 'QA/QE Automation',
                            skill: 'Selenium Automation Testing',
                            rating: 3,
                            expirienceM: 12,
                            status: 'Approved',
                            lastUsed: '20-Jan-2019',
                            type: 'Secondary'

                        },


                    ],
                }
            ]
        }
    ]
    return data
}
export default getResourceData

export function getTableData() {
    let tableData = [
        {
            skillGroup: 'Skill Group',
            skill: 'Skill',
            rating: 'Rating',
            exp: 'Exp(Months)',
            status: 'Status',
            lastUsed: 'Last Used',
            type: 'Type'
        },
        {
            skillGroup: 'QA/QE Automation',
            skill: 'Selenium Automation Testing',
            rating: 3,
            exp: 10,
            status: 'Approved',
            lastUsed: '20-Jan-2019',
            type: 'Secondary'

        },
        {
            skillGroup: 'QE Automation',
            skill: 'Selenium Automation Testing1',
            rating: 2,
            exp: 12,
            status: 'Approved',
            lastUsed: '20-Jan-2020',
            type: 'Primary'

        },

    ]
    return tableData
}