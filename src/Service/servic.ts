import {SPFI,spfi,ICamlQuery, SPFx} from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IHandlingLargeListState } from "../webparts/handlingLargeListData/components/IHandlingLargeListState";

export class ServiceClass{
    private sp:SPFI;
    constructor(context:WebPartContext){
        this.sp=spfi().using(SPFx(context));
    }
    //get more than 5000 items
    //hello
    
    public async _getListItems(ListName:string):Promise<IHandlingLargeListState[]>{
        const _allItems:IHandlingLargeListState[]=[];
        let position:any=null;
        do{
            const camQuery:ICamlQuery={
                ViewXml:`
                <View>
                <Query>
                <Where>
                <IsNotNull>
                <FieldRef Name='Title'/>
                </IsNotNull>
                </Where>
                </Query>
                <RowLimit>2000</RowLimit>
                </View>
                `
            };
            const response =await this.sp.web.lists.getByTitle(ListName).getItemsByCAMLQuery(camQuery,position);
            console.log(`Fetched batch of ${response.length} items`);
            _allItems.push(...response.map((item:any)=>({
                Title:item.Title
            })));
            position=null;

        }
        while(position){
            console.log(`Totla items fetched ${_allItems.length}`);
            return _allItems;
        }
    }
}