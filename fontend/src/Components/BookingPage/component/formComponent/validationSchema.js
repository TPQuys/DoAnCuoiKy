// validationSchema.js
import * as Yup from 'yup';
import dayjs from 'dayjs';

export const validationSchema = (maxTable) => Yup.object().shape({
    EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
    TotalTable: Yup.number()
        .required('Vui lòng nhập tổng số bàn')
        .positive('Số bàn phải là số dương')
        .integer('Số bàn phải là số nguyên')
        .min(maxTable * 0.7, `Số bàn tối thiểu là ${Math.round(maxTable * 0.7)}`)
        .max(maxTable, `Số bàn tối đa là ${maxTable}`),
    EventDate: Yup.date()
        .required('Vui lòng chọn ngày')
        .test(
            'check-date',
            'Ngày đặt phải trước 3 ngày với hơn 30 bàn, 4 ngày với hơn 50 bàn, và 6 ngày với hơn 90 bàn',
            function (value) {
                const { TotalTable } = this.parent;
                if (!value) return false;

                const today = dayjs();
                const eventDate = dayjs(value);
                let minDays = 1;

                if (TotalTable > 30 && TotalTable <= 50) {
                    minDays = 3;
                } else if (TotalTable > 50 && TotalTable <= 90) {
                    minDays = 4;
                } else if (TotalTable > 90) {
                    minDays = 6;
                }

                return eventDate.isAfter(today.add(minDays, 'day'));
            }
        ),
    Time: Yup.string().required('Vui lòng chọn thời gian'),
    Note: Yup.string(),
});
