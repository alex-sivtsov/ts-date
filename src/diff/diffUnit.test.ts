import * as assert from 'power-assert';
import {createTsDate} from '../create/create-ts-date';
import {
	diffMilliseconds,
	diffSeconds,
	diffMinutes,
	diffHours,
	diffDate,
	diffMonth,
	diffYear,
} from './diffUnit'
import {addUTCHours} from '../add/addUnit';

function dstForYear(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const startOffset = start.getTimezoneOffset();
	const current = new Date(start);
    while (current < end) {
        current.setDate(current.getDate() + 1);
        if (current.getTimezoneOffset() !== startOffset) {
        	let lastChangeHour;
			for (let i = -12; i < 12; i++) {
				const changeHour = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1, i);
				if (changeHour.getTimezoneOffset() !== startOffset) {
					return lastChangeHour;
				}
				lastChangeHour = changeHour;
			}
			return;
        }
    }
}

describe('diffUnit', function () {
	describe('returns the number of full units between the given dates', function () {
		it('diffMilliseconds', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 102));
			const result = diffMilliseconds(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffSeconds', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 12, 31, 1, 100));
			const result = diffSeconds(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffMinutes', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 12, 32, 59, 100));
			const result = diffMinutes(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffHours', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 14, 30, 59, 100));
			const result = diffHours(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffDate', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Jul, 1, 12, 30, 59, 100));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffMonth', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
			const tsDate2 = createTsDate(new Date(2017, Month.Aug, 29, 12, 30, 59, 100));
			const result = diffMonth(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});

		it('diffYear', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29));
			const tsDate2 = createTsDate(new Date(2019, Month.Jun, 29));
			const result = diffYear(tsDate2, tsDate1);
			assert.deepEqual(result, 2);
		});
	});

	describe('diffDate edge cases', function () {
		it('less then a day', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 28, 0, 0, 0, 1));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 0);
		});
		it('less then a day reverse', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 28, 0, 0, 0, 1));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 0);
		});
		it('same day', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29, 23, 59, 59, 999));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 0);
		});
		it('same day reverse', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 29));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 23, 59, 59, 999));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 0);
		});
		it('diff with same time', function () {
			const tsDate1 = createTsDate(new Date(2017, Month.Jun, 19, 23, 30));
			const tsDate2 = createTsDate(new Date(2017, Month.Jun, 29, 23, 30));
			const result = diffDate(tsDate2, tsDate1);
			assert.deepEqual(result, 10);
		});
	});

	describe('diffMonth edge cases', function() {
		it('diff between same month', function () {
			const a = createTsDate(new Date(2017, Month.Jan, 1, 0));
			const c = createTsDate(new Date(2017, Month.Jan, 31, 23, 59, 59));

			assert.equal(diffMonth(c, a), 0);
		});
		it('diff between last days of month', function () {
			const a = createTsDate(new Date(2017, Month.Feb, 28, 1));
			const c = createTsDate(new Date(2017, Month.Mar, 31, 0));

			assert.equal(diffMonth(c, a), 1);
		});
		it('diff between last seconds of month', function () {
			const a = createTsDate(new Date(2017, Month.Apr, 30, 23, 59, 59, 999));
			const b = createTsDate(new Date(2017, Month.May, 30, 23, 59, 59, 998));
			const c = createTsDate(new Date(2017, Month.May, 30, 23, 59, 59, 999));

			assert.equal(diffMonth(b, a), 0);
			assert.equal(diffMonth(c, a), 1);
		});
	});

	describe('diffYear edge cases', function() {
		it('diff between leap years', function () {
			const d1 = createTsDate(new Date(2016, Month.Feb, 29));
			const d2 = createTsDate(new Date(2017, Month.Feb, 28, 23, 59, 59, 999));
			const d3 = createTsDate(new Date(2020, Month.Feb, 29));

			assert.equal(diffYear(d2, d1), 0);
			assert.equal(diffYear(d3, d1), 4);
		});
	});

	describe('dst', function() {
		it('diffHours across dst', function () {
			const dst = dstForYear(2017);
			if (!dst) return;

			const tsDstDate = createTsDate(dst);
			const tsDstDate2HoursUTC = addUTCHours(tsDstDate, 2);
			assert.equal(diffHours(tsDstDate2HoursUTC, tsDstDate), 2);
		});
	});
});
