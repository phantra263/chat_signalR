import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value): string {
    const valueDate = new Date(value);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime.getTime() - valueDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    switch (true) {
      case years > 0:
        return `${years} năm trước`;
      case months > 0:
        return `${months} tháng trước`;
      case days > 0:
        return `${days} ngày trước`;
      case hours > 0:
        return `${hours} giờ trước`;
      case minutes > 0:
        return `${minutes} phút trước`;
      default:
        return `Vừa xong`;
    }
  }
}
