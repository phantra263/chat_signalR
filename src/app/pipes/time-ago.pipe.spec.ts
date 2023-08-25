import { TimeAgoPipe } from './time-ago.pipe';


// kiểm thử pipes (nâng cao)
describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('transforms "now" into "Vừa xong"', () => {
    const value = new Date();
    const result = pipe.transform(value);
    expect(result).toBe('Vừa xong');
  });

  it('transforms a date into "x phút trước" if less than an hour', () => {
    const value = new Date();
    value.setMinutes(value.getMinutes() - 10); // 10 minutes ago
    const result = pipe.transform(value);
    expect(result).toBe('10 phút trước');
  });

  it('transforms a date into "x giờ trước" if less than a day', () => {
    const value = new Date();
    value.setHours(value.getHours() - 5); // 5 hours ago
    const result = pipe.transform(value);
    expect(result).toBe('5 giờ trước');
  });

  it('transforms a date into "x ngày trước" if less than a month', () => {
    const value = new Date();
    value.setDate(value.getDate() - 7); // 7 days ago
    const result = pipe.transform(value);
    expect(result).toBe('7 ngày trước');
  });

  it('transforms a date into "x tháng trước" if less than a year', () => {
    const value = new Date();
    value.setMonth(value.getMonth() - 3); // 3 months ago
    const result = pipe.transform(value);
    expect(result).toBe('3 tháng trước');
  });

  it('transforms a date into "x năm trước" if more than a year', () => {
    const value = new Date();
    value.setFullYear(value.getFullYear() - 2); // 2 years ago
    const result = pipe.transform(value);
    expect(result).toBe('2 năm trước');
  });
});
