import InputTextComponent from '../HtmlComponent/InputTextComponent'
//import GridViewComponent from '../HtmlComponent/GridViewComponent'
import InputDateComponent from '../HtmlComponent/InputDateComponent'
import SelectListComponent from '../HtmlComponent/SelectListComponent'
import React from 'react'
import moment from 'moment'
import SearchPaymentService from '../Services/SearchPayment'
import GridViewComponent from '../HtmlComponent/GridViewComponent';

export default class SearchComponent extends React.Component{
    state={
        data:null,
        gridColumns:null,
        statusOption:[],
        SearchParamters:{},
        Columns:[
            {name:"PaymentStatus",description:"Status",format:null},
            {name:"TransactionReference",description:"Transaction Reference",format:null},
            {name:"PayoutBankDetails",description:"Nostro BankName",format:this.ShowPayoutBankDetails},
            {name:"Amount",description:"Transaction Amount",format:this.FormatAmount},
            {name:"Status",description:"CCTStaus",format:null},
            {name:"ActualValueDate",description:"Actual Value Date",format:null},
            {name:"CustomerAccountNumber",description:"Client Account",format:null},
            {name:"PaymentMethod",description:"Payment Method",format:null},
            {name:"OnHold",description:"Hold",format:this.IsPaymentHasHold},
            {name:"PublicId",description:"PublicId",format:null}            
        ],
        isloading:false,
        pagesize:[],
        mappingKey:"PublicId"
    }
    ShowPayoutBankDetails(payoutBankObj){
        var payoutBankName=payoutBankObj.BankName;
        //var payoutBankEntiry=payoutBankObj.AccountEntity;
        //var payoutBankSwift=payoutBankObj.BankSwift;
        //var payoutAccountNumber=payoutBankObj.AccountNumber;
        return payoutBankName;
    };
    FormatAmount(amountObj){
        var TransactionAmount=null;
        var amount=amountObj.Amount;
        var numberOfDecimals=amountObj.NumberOfDecimals;
        var currencyCode= amountObj.CurrencyCode;
        if(numberOfDecimals){
            TransactionAmount=parseFloat(TransactionAmount).toFixed(parseInt(numberOfDecimals));
        }
        else{
            TransactionAmount=amount;
        }
        if(currencyCode){
            TransactionAmount =`${amount} ${currencyCode}`;
        }
        return TransactionAmount;
    }
    componentDidMount(){
        this.setState({
            statusOption:[{text:"----------",value:-1},{text:"Released",value:776},{text:"Avaliable For Release",value:775}],
            pagesize:[{text:10,value:10},{text:25,value:25},{text:50,value:50},{text:100,value:100}]
            }
        )
        
    }
    SearchPayments=(e)=>{
        e.preventDefault();
        this.FetchPayments();
    }
    FetchPayments=()=>{
        this.setState({
            isloading:true
        })
        var searchPaymentsResult=new SearchPaymentService().SearchPayment(this.state.SearchParamters);
        searchPaymentsResult.then((result)=>{
         var data=result.PaymentStoreList;
         this.setState({
             data:data,
             isloading:false
         });
        }).catch(err=>{
            this.setState({
                data:null
            });
        });
    }
    IsPaymentHasHold(holdobj){
        if(holdobj){
            return 'Yes'
        }else
        {
            return 'NO'
        }
    }
    TransactionReferenceChange=(e)=>{
        var value=e.target.value
       this.setState(prevState=>({
        SearchParamters:{
            ...prevState.SearchParamters,
            TransactionReference:value
        }
       }));
       
    }
    FromReleaseDateChange=(e)=>{
        var currentdateTime=moment().toDate().getTime();
        var value=moment(e.target.value).add(currentdateTime,"millisecond").utc();
        this.setState((prevState)=>({
            SearchParamters:{
                ...prevState.SearchParamters,
                FromReleaseDate:value.toISOString()
            }
        }));
    }
    ToReleaseDateChange=(e)=>{
        var releasedate=e.target.value.concat(' ','00:00:00');
        var value=moment(releasedate).utc();
        this.setState((prevState)=>({
            SearchParamters:{
                ...prevState.SearchParamters,
                ToReleaseDate:value.toISOString()
            }
        }));
    }
    StatusChange=(e)=>{
        var status=e.target.value;
        this.setState((prevState)=>({
            SearchParamters:{
                ...prevState.SearchParamters,
                Status:status!=="-1"?parseInt(status):null
            }
        }));
    }
    PageSizeChange=(e)=>{
        var pagesize=e.target.value;
        this.setState((prevstate)=>({
            SearchParamters:{
                ...prevstate.SearchParamters,
                pagesize:pagesize
            }
        }),this.FetchPayments);
        
    }
    render(){
        return( 
            <form onSubmit={this.SearchPayments}>
            <table>
            <tbody>
            <tr>
            <td>TransactionReference:</td>
            <td><InputTextComponent name="TransactionReference" id="TransactionReference" onChange={this.TransactionReferenceChange} /></td>
            </tr>
            <tr>
            <td>From Release Date:</td>
            <td><InputDateComponent name="fromReleaseDate" id="fromReleaseDate" onChange={this.FromReleaseDateChange} /></td>
            </tr>
            <tr>
            <td>To Release Date:</td>
            <td><InputDateComponent name="toReleaseDate"  id="toReleaseDate" onChange={this.ToReleaseDateChange}/></td>
            </tr>
            <tr>
            <td>Status:</td>
            <td><SelectListComponent name="status" id="status" optionsList={this.state.statusOption} onChange={this.StatusChange}  />
            </td>
            </tr>
            <tr><td colSpan='2'><button>Submit</button></td></tr>
            </tbody>
        </table>
        {this.state.data? <SelectListComponent name="pagesize" id="pagesize" optionsList={this.state.pagesize} onChange={this.PageSizeChange}></SelectListComponent>:null}
        {this.state.isloading?"Loading....":null}
        {this.state.data?<GridViewComponent data={this.state.data} mappingKey={this.state.mappingKey} columns={this.state.Columns}/>:null}
        </form>
        )
    }

}