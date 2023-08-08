import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { SignalRService } from './services/signalr.service';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatService } from './services/chat.service';
import { TimeMessFormatPipe } from './pipes/time-mess.pipe';


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
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    FormsModule,
    NgxEmojiPickerModule,

    HttpClientModule
  ],
  providers: [
    SignalRService,
    ChatService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
