const mls = [
    {name:'A_c',label:'Air Conditioning'},
    {name:'Addr',label:'Address'},
    {name:'Ad_text',label:'Description'},
    {name:'Area',label:'Area'},
    {name:'Addr',label:'Address'},
    {name:'Bath_tot',label:'Bath rooms'},
    {name:'Br',label:'Bed rooms'},
    {name:'Community',label:'Community'},
    {name:'Cross_st',label:'Cross street'},
    {name:'Extras',label:'Extras description'},
    {name:'Heating',label:'Heating'},
    {name:'Lp_dol',label:'Price'},
    {name:'Ml_num',label:'Ml number'},
    {name:'Municipality',label:'Municipality'},
    {name:'Sqft',label:'Sqft'},
    {name:'Taxes',label:'Taxes'},
    {name:'Tour_url',label:'Tour url'},
    {name:'photos',label:'Photos',type:'array'},
    {name:'Front_ft',label:'Front width'},
    {name:'Depth',label:'Depth'},
]
const TemplateDataSource = [
    {label:"None",value:"none",struct:undefined},
    {label:"Mls data",value:"mls",struct:mls},
]

const getTemplateDataSource = (value)=>{
    for(let i=0;i<TemplateDataSource.length;i++) {
        if(TemplateDataSource[i].value === value) {
            return TemplateDataSource[i]
        }
    }
}
export {
    TemplateDataSource,getTemplateDataSource,
}