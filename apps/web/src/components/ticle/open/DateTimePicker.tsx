import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { Control, useController } from 'react-hook-form';
import { OpenFormInputs } from '@repo/types/src/formSchema';

import ExclamationIc from '@/assets/icons/exclamation.svg?react';

const todayDate = new Date();

interface DateTimePickerProps {
  required?: boolean;
  control: Control<OpenFormInputs>;
}

function DateTimePicker({ required, control }: DateTimePickerProps) {
  const {
    field: { value: startDate, onChange: setStartDate },
    fieldState: { error: startDateError },
  } = useController({
    name: 'startDate',
    control,
  });

  const {
    field: { value: endDate, onChange: setEndDate },
    fieldState: { error: endDateError },
  } = useController({
    name: 'endDate',
    control,
  });

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const filterPassedTime = (time: Date) => {
    const selectedDate = new Date(time);
    return todayDate.getTime() < selectedDate.getTime();
  };

  const filterEndTime = (time: Date) => {
    if (!startDate) return false;

    const selectedDate = new Date(time);
    if (!isSameDay(startDate, selectedDate)) {
      return false;
    }
    return startDate.getTime() < selectedDate.getTime();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-title2 text-main">
        진행 일정
        {required && (
          <span className="text-error" aria-label="필수 입력">
            {' *'}
          </span>
        )}
      </label>
      <div className="flex gap-1.5">
        <DatePicker
          locale={ko}
          selected={startDate}
          onChange={(date: Date | null) => {
            setStartDate(date);
            if (endDate && !isSameDay(date as Date, endDate)) {
              setEndDate(null);
            }
          }}
          showTimeSelect
          filterTime={filterPassedTime}
          dateFormat="yyyy년 MM월 dd일 HH:mm"
          className="w-full rounded-base border border-main px-3.5 py-2.5 text-body1 outline-none placeholder:text-weak focus:border-primary"
          placeholderText="시작 시간을 선택해 주세요."
          minDate={todayDate}
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="시간"
        />
        <DatePicker
          locale={ko}
          selected={endDate}
          onChange={setEndDate}
          showTimeSelect
          filterTime={filterEndTime}
          dateFormat="yyyy년 MM월 dd일 HH:mm"
          className="w-full rounded-base border border-main px-3.5 py-2.5 text-body1 outline-none placeholder:text-weak focus:border-primary"
          placeholderText="종료 시간을 선택해 주세요."
          minDate={startDate}
          maxDate={startDate}
          disabled={!startDate}
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="시간"
        />
      </div>
      {(startDateError || endDateError) && (
        <p className="flex items-center gap-1 text-label1 text-error">
          <ExclamationIc className="fill-error" width={9} height={9} aria-hidden />
          {startDateError?.message || endDateError?.message}
        </p>
      )}
    </div>
  );
}

export default DateTimePicker;
