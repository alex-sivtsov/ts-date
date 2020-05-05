import {Month} from '../utils/basic-types';
import * as assert from 'power-assert';
import {newValidDate} from '../create/create-ts-date';
import {addMilliseconds, addSeconds, addMinutes, addHours, addDate, addMonth, addYear} from './add-unit';

describe('addUnits', function () {
	const addUnitList = [addMilliseconds, addSeconds, addMinutes, addHours, addDate, addMonth, addYear];

	describe('add given amount of units', function () {
		it('addMilliseconds', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addMilliseconds(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Jun, 29, 12, 30, 59, 102));
		});

		it('addSeconds', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addSeconds(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Jun, 29, 12, 31, 1, 100));
		});

		it('addMinutes', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addMinutes(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Jun, 29, 12, 32, 59, 100));
		});

		it('addHours', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addHours(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Jun, 29, 14, 30, 59, 100));
		});

		it('addDate', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addDate(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Jul, 1, 12, 30, 59, 100));
		});

		it('addMonth', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
			const result = addMonth(tsDate, 2);
			assert.deepEqual(result, new Date(2017, Month.Aug, 29, 12, 30, 59, 100));
		});

		it('addYear', function () {
			const tsDate = newValidDate(2017, Month.Jun, 29);
			const result = addYear(tsDate, 2);
			assert.deepEqual(result, new Date(2019, Month.Jun, 29));
		});
	});

	describe('edge cases', function () {
		it('falls to null with invalid date', function () {
			for (const addUnit of addUnitList) {
				const result = addUnit(null, 2);
				assert.deepEqual(result, null);
			}
		});

		it('no changes with "Infinity" value', function () {
			for (const addUnit of addUnitList) {
				const tsDate = newValidDate(2017, Month.Jun, 29);
				const result = addUnit(tsDate, Infinity);
				assert.deepEqual(result, tsDate);
			}
		});

		it('no changes with "NaN" value', function () {
			for (const addUnit of addUnitList) {
				const tsDate = newValidDate(2017, Month.Jun, 29);
				const result = addUnit(tsDate, NaN);
				assert.deepEqual(result, tsDate);
			}
		});
	});

	it('does not mutate the original date', function () {
		const tsDate = newValidDate(2017, Month.Jun, 29, 12, 30, 59, 100);
		[addMilliseconds, addSeconds, addMinutes, addHours, addDate, addMonth, addYear].forEach((method) =>
			method(tsDate, 1),
		);
		assert.deepEqual(tsDate, new Date(2017, Month.Jun, 29, 12, 30, 59, 100));
	});
});
