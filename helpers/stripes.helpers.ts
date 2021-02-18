import axiod from "https://deno.land/x/axiod/mod.ts";
import { config } from '../config/config.ts';



export const addCard = async(numberCard: number, exp_month: number, exp_year: number, cvc?: number) => {
    let payload: any = {
        "card[number]": String(numberCard),
        "card[exp_month]": String(exp_month),
        "card[exp_year]": String(exp_year),
    };
    
    const body = convertToFormBody(payload);
    return await axiod(`https://api.stripe.com/v1/tokens`, getConfigAxiod('post', body))//
}

export const addCustomer = async(email: string, fullName: string) => {
    let payload: any = {
        "email": email,
        "name": fullName,
    };
    const body = convertToFormBody(payload);
    return await axiod("https://api.stripe.com/v1/customers", getConfigAxiod('post', body))
}

export const AddCustomerCardStripe = async(idCustomer: string, idCard: string) => {
    if(idCustomer === undefined || idCustomer === null) return;
    let payload: any = {
        "source" : idCard
    };
    const body = convertToFormBody(payload);
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}/sources`, getConfigAxiod('post', body))
}

export const addProductStripe = async(name: string, description: string, unitAmount: number = 500, currency: string = 'eur') => {
    let payload: any = {
        name: name,
        description: description
    };
    const body = convertToFormBody(payload);
    const responseAddProduct = await axiod(`https://api.stripe.com/v1/products`, getConfigAxiod('post', body))
    return await addPriceProductStripe(responseAddProduct.data.id, unitAmount, currency);
}

const addPriceProductStripe = async(idProduct: string, unitAmount: number = 500, currency: string = 'eur') => {
    let payload: any = {
        "product": idProduct,
        "currency": currency.toLowerCase(),
        "unit_amount": unitAmount < 0 ? 500 : unitAmount,// equivalent a 500 centimes soit 5.00 Euros
        "billing_scheme": "per_unit",
        "recurring[interval]":"month",
        "recurring[interval_count]":"1",
        "recurring[trial_period_days]":"0",
        "recurring[usage_type]":"licensed"
       
    };
    const body = convertToFormBody(payload);
    return await axiod(`https://api.stripe.com/v1/prices`, getConfigAxiod('post', body))
}

export const payment = async(idCustomer: string | undefined, idPrice: string, quantity: number = 1) => {
    if(idCustomer === null || idCustomer === undefined){
        return;
    }else{
        let payload: any = {
            "customer": idCustomer,
            "off_session": String(true),
            "collection_method": "charge_automatically",
            "items[0][price]": idPrice,
            "items[0][quantity]": String(quantity),
            "enable_incomplete_payments": String(false) 
        };
        const body = convertToFormBody(payload);
        return await axiod(`https://api.stripe.com/v1/subscriptions`, getConfigAxiod('post', body))
    }
}
 
export const getCustomerStripe = async(idCustomer: string) => {
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}`, getConfigAxiod('get'))
}


const getConfigAxiod = (methodReq: string, body: any = null) => {
    const configAxiod = {
        method: methodReq.trim().toLowerCase(),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${config.STRIPE_TOKEN_SECRET}`, 
        },
        data: body
    };
    body === null ? delete configAxiod.data : configAxiod;
    return configAxiod;
}


const convertToFormBody = (cardDetails: any) => {
    let body: any = [];
    for (let property in cardDetails) {
        //cardDetails.hasOwnProperty(property)
        body.push(encodeURIComponent(property) + '=' + encodeURIComponent(cardDetails[property]));
    }
    return body.join("&");
}

const toUrlEncoded = (obj: any) => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
 
const getFormData = (object: any) => {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}