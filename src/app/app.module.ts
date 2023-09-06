import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignalRService } from './services/signalr.service';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatService } from './services/chat.service';
import { TimeMessFormatPipe } from './pipes/time-mess.pipe';
import { Chat_v2Component } from './pages/chat_v2/chat_v2.component';
import { ChatDetailComponent } from './pages/chatDetail/chatDetail.component';
import { FormComponent } from './pages/form/form.component';
import { CommonService } from './services/common.service';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';
import { SettingComponent } from './pages/setting/setting.component';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './reducers/app.reducer';
import { AppEffects } from './effects/app.effects';
import { ModalComponent } from './pages/modal/modal.component';
import { StoreModule, ActionReducerMap, MetaReducer } from '@ngrx/store';


registerLocaleData(en);

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  var translateHttpLoader = new TranslateHttpLoader(http)
  return translateHttpLoader
}

@NgModule({
  declarations: [
    TimeAgoPipe,
    TimeMessFormatPipe,
    AppComponent,
    ChatComponent,
    Chat_v2Component,
    ChatDetailComponent,
    FormComponent,
    PageNotFoundComponent,
    SettingComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEmojiPickerModule,
    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
    HttpClientModule
  ],
  providers: [
    SignalRService,
    ChatService,
    CommonService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
