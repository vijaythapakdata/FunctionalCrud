import * as React from 'react';
// import styles from './HandlingLargeListData.module.scss';
import type { IHandlingLargeListDataProps } from './IHandlingLargeListDataProps';
import { ServiceClass } from '../../../Service/servic';
import { IHandlingLargeListState } from './IHandlingLargeListState';
import { DetailsList } from '@fluentui/react';

const HandlingLargeListData:React.FC<IHandlingLargeListDataProps>=(props)=>{
  const[ListResult,setListResult]=React.useState<IHandlingLargeListState[]>([]);
  const _service=new ServiceClass(props.context);
  React.useEffect(()=>{
    const fetchData=async()=>{
      try{
      const result=await _service._getListItems(props.ListName);
      setListResult(result);
      }
      catch(err){
        console.error(err);
      }
    };
    fetchData();
  },[props.ListName,_service])
  return(
    <>
    <DetailsList
    
    items={ListResult}/></>
  )
}
export default HandlingLargeListData;
