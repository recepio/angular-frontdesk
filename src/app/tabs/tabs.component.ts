import { Component, OnInit, ContentChildren, QueryList, AfterContentInit,
    ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { TabComponent } from '../tab/tab.component';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})


export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    ngAfterContentInit() {
        let activeTabs = this.tabs.filter((tab)=>tab.active);

        if(activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab){
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;
    }
}