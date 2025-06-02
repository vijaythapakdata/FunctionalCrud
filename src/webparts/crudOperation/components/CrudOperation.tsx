import * as React from 'react';
// import styles from './CrudOperation.module.scss';
import type { ICrudOperationProps } from './ICrudOperationProps';
import { spfi,SPFx } from '@pnp/sp/presets/all';
import { DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, IconButton, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';

interface ICrudOperationState{
  Title:string;
  EmailAddress:string
  Id:number;
}
interface ICrud{
  name:string;
  email:string;
  id:number
}
const CrudOperation=(props:ICrudOperationProps):React.ReactElement=>{
  const _sp=spfi().using(SPFx(props.context));
   const [states,setStates]=React.useState<Array<ICrud>>([]); //state to hold the list items
   const[reload,setReload]=React.useState<boolean>(false); //reload state to trigger re-render
   const[isAddHidden,setIsAddHidden]=React.useState<boolean>(true); //state to toggle add form visibility
   const[isEditHidden,setIsEditHidden]=React.useState<boolean>(true); //state to toggle edit form visibility
   const[curentId,setCurentId]=React.useState<number|any>(); //current item id for edit/delete operations
   const [newTitle,setNewTitle]=React.useState<string>(""); //new title state
   const [newEmail,setNewEmail]=React.useState<string>("");// new email state
   const [editTitle,setEditTitle]=React.useState<string>("");//edit title state
   const [editEmail,setEditEmail]=React.useState<string>(""); //edit email state
   React.useEffect(()=>{
    _getAllItems();
   },[reload])

   const _getAllItems=async()=>{
    try{
      const items=await _sp.web.lists.getByTitle(props.ListName).items();
      setStates(items.map((item:ICrudOperationState)=>({
        name:item.Title,
        email:item.EmailAddress,
        id:item.Id
      })))
    }
    catch(error){
      console.error("Error fetching items: ", error);
    }
   }
   //Event for adding title
   const handleNewTitle=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setNewTitle(event.target.value);
   }
   const handleNewEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setNewEmail(event.target.value);
   }
   const _addItem=async()=>{
    const list=await _sp.web.lists.getByTitle(props.ListName);
    try{
      await list.items.add({
Title:newTitle,
EmailAddress:newEmail
      });
      setIsAddHidden(true);
      setReload(!reload)
    }
    catch(error){
      console.error("Error adding item: ", error);
    }
    finally{
      setIsAddHidden(true);
    }
   }
   //opent dialog
   const _openEditDialog=(id:number)=>{
    setCurentId(id);

    //this function will open the dialog and expose the form
     setIsEditHidden(false);
    const item:ICrud|undefined=states.find((each:any)=>each.id===id);
    if(item){
      setEditTitle(item.name);
      setEditEmail(item.email);
    }
   }
    const handleEditTitle=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setEditTitle(event.target.value);
   }
    const handleEditEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setEditEmail(event.target.value);
   }
//update item
const _updateItem=async()=>{
  const list=await _sp.web.lists.getByTitle(props.ListName);
  try{
    await list.items.getById(curentId).update({
      Title:editTitle,
      EmailAddress:editEmail
    })
    setIsEditHidden(true);
    setReload(!reload)
  }
  catch(error){
    console.error("Error updating item: ", error);
  }
  finally{
   setIsEditHidden(true);
  }
} 
//delete item
const _deleteItem=async(id:number)=>{
  const list=await _sp.web.lists.getByTitle(props.ListName);
  try{
    await list.items.getById(id).delete();
    setReload(!reload);
    console.log("Item deleted successfully");
  }
  catch(err){
    console.error("Error deleting item: ", err);
  }
}
  return(
    <>
    <div className='TitleBox'>
      <h2>Editable Table</h2>
      <div className='TitleContainer'>
<DetailsList
items={states||[]}
columns={[
  {key:'Name',
    name:'Title',
    fieldName:'Title',
    minWidth:100,
    isResizable:true,
    onRender:(item:ICrud)=><div>{item.name}</div>
  },
    {key:'Email',
    name:'Email',
    fieldName:'EmailAddress',
    minWidth:100,
    isResizable:true,
    onRender:(item:ICrud)=><div>{item.email}</div>
  },
  {
    key:'ActionColumn',
    name:'Action',
    fieldName:'Action',
    minWidth:100,
    isResizable:true,
   onRender:(item:ICrud)=>(
    <div>
      <IconButton
      iconProps={{iconName:'edit'}}
      onClick={()=>_openEditDialog(item.id)}
      title='Edit'
      ariaLabel='Edit'
      />
      <IconButton
      iconProps={{iconName:'delete'}}
      onClick={()=>_deleteItem(item.id)}
      title='Delete'
      ariaLabel='Delete'
      />

      </div>
   )
  }
  
]}
selectionMode={SelectionMode.none}
/>
     <Dialog
     hidden={isEditHidden}
     onDismiss={()=>setIsEditHidden(true)}
     dialogContentProps={{
      type:DialogType.normal,
      title:'Edit Form'
     }}
     >
      <div>
        <TextField
        label='Name'
        value={editTitle}
        onChange={handleEditTitle}
        />
            <TextField
        label='Email'
        value={editEmail}
        onChange={handleEditEmail}
        />
      </div>
      <DialogFooter>
<PrimaryButton text='Save' onClick={()=>_updateItem()}
  iconProps={{iconName:'save'}}/>
<DefaultButton text='Cancel' onClick={()=>setIsEditHidden(true)}
  iconProps={{iconName:'cancel'}}/>
      </DialogFooter>
      </Dialog>   
      </div>
    </div>
    <div>
      <PrimaryButton
      text='Add Item'
      iconProps={{iconName:'add'}}
      onClick={()=>setIsAddHidden(false)}
      />
      <Dialog
      hidden={isAddHidden}
      onDismiss={()=>setIsAddHidden(true)}
      dialogContentProps={{
        type:DialogType.normal,
        title:'Add item'
      }}
      >
       <TextField
        label='Name'
        value={newTitle}
        onChange={handleNewTitle}
        />
            <TextField
        label='Email'
        value={newEmail}
        onChange={handleNewEmail}
        />
    
    <DialogFooter>
      <PrimaryButton text='Save' onClick={()=>_addItem()}
  iconProps={{iconName:'save'}}/>
<DefaultButton text='Cancel' onClick={()=>setIsAddHidden(true)}
  iconProps={{iconName:'cancel'}}/>
    </DialogFooter>
    </Dialog>

    </div>
    </>
  )
}
export default CrudOperation;
