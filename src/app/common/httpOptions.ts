import { HttpHeaders } from "@angular/common/http";

export const httpOptions: any = {
    observe: "body",
    headers: new HttpHeaders({
        "Content-Type": "application/json-patch+json",
        "Accept": "text/plain"
    })
};