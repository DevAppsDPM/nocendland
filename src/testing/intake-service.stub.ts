import {signal} from '@angular/core';

export function createIntakeServiceStub() {
  return {
    multiselectList: signal(false),
    readIntakesByDate: () => Promise.resolve([]),
    saveIntake: () => Promise.resolve(undefined),
    saveIntakes: () => Promise.resolve([]),
    deleteIntakes: () => Promise.resolve([])
  };
}
