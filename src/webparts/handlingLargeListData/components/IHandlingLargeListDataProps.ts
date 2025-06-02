import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHandlingLargeListDataProps {
  ListName:string;
  context:WebPartContext;
  siteurl:string;
}
