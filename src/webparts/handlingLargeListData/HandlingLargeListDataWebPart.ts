import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import * as strings from 'HandlingLargeListDataWebPartStrings';
import HandlingLargeListData from './components/HandlingLargeListData';
import { IHandlingLargeListDataProps } from './components/IHandlingLargeListDataProps';

export interface IHandlingLargeListDataWebPartProps {
 ListName: string;
}

export default class HandlingLargeListDataWebPart extends BaseClientSideWebPart<IHandlingLargeListDataWebPartProps> {

 

  public render(): void {
    const element: React.ReactElement<IHandlingLargeListDataProps> = React.createElement(
      HandlingLargeListData,
      {
      ListName: this.properties.ListName,
       context:this.context,
       siteurl:this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

 




  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
