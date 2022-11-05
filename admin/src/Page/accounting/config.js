const balance_products = [
    {value:'privateclass',label:'Private balance'},
    {value:'groupclass',label:'Group balance'}
]
const getBalanceProduct = (k)=>{
    for(let i=0;i<balance_products.length;i++) {
        if(balance_products[i].value == k)
            return balance_products[i]
    }
    return {value:'none',label:"None"}
}
export {
    balance_products,getBalanceProduct
}