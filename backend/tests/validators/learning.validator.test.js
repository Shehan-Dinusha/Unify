import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  createModuleValidator,
  getModuleDetailsValidator,
  editModuleDetailsValidator,
  deleteModuleValidator,
  createModuleCategoryValidator,
  getModuleCategoriesValidator,
  updateModuleCategoryValidator,
  deleteModuleCategoryValidator,
  uploadMaterialValidator,
  editMaterialValidator,
  deleteMaterialValidator,
  getMaterialsByCategoryValidator,
  getBatchRepsValidator,
  getSemesterVisibilityValidator,
  updateSemesterVisibilityValidator,
  getBatchRepCourseStructureValidator,
} from '../../src/validators/learning.validator.js';

const getError = async (schemaArray, data) => {
  const req = { body: data, params: {}, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

const getErrorWithParams = async (schemaArray, params) => {
  const req = { body: {}, params, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

const getErrorWithQuery = async (schemaArray, query) => {
  const req = { body: {}, params: {}, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

describe('createModuleValidator', () => {
  const valid = { title: 'Math', code: 'MATH101', semester: '1', visibility: [1, 2] };
  it('accepts valid data', async () => {
    assert.equal(await getError(createModuleValidator, valid), null);
  });
  it('rejects missing title', async () => {
    assert.match(await getError(createModuleValidator, { ...valid, title: '' }), /title/i);
  });
  it('rejects missing code', async () => {
    assert.match(await getError(createModuleValidator, { ...valid, code: '' }), /code/i);
  });
  it('rejects missing semester', async () => {
    assert.match(await getError(createModuleValidator, { ...valid, semester: '' }), /semester/i);
  });
  it('rejects non-array visibility', async () => {
    assert.match(await getError(createModuleValidator, { ...valid, visibility: 'all' }), /visibility/i);
  });
  it('rejects empty visibility array', async () => {
    assert.match(await getError(createModuleValidator, { ...valid, visibility: [] }), /visibility/i);
  });
});

describe('getModuleDetailsValidator', () => {
  it('accepts valid integer param', async () => {
    assert.equal(await getErrorWithParams(getModuleDetailsValidator, { id: '5' }), null);
  });
  it('rejects non-integer param', async () => {
    assert.match(await getErrorWithParams(getModuleDetailsValidator, { id: 'abc' }), /integer/i);
  });
  it('rejects missing param', async () => {
    assert.match(await getErrorWithParams(getModuleDetailsValidator, {}), /module ID/i);
  });
});

describe('editModuleDetailsValidator', () => {
  it('accepts valid edit with all fields', async () => {
    const req = { body: { title: 'New Title', code: 'CS102', visibility: [1] }, params: { id: '3' }, query: {} };
    for (const v of editModuleDetailsValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('accepts partial edit (title only)', async () => {
    const req = { body: { title: 'New Title' }, params: { id: '3' }, query: {} };
    for (const v of editModuleDetailsValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('rejects non-integer param', async () => {
    const req = { body: { title: 'X' }, params: { id: 'abc' }, query: {} };
    for (const v of editModuleDetailsValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), false);
  });
});

describe('deleteModuleValidator', () => {
  it('accepts valid integer param', async () => {
    assert.equal(await getErrorWithParams(deleteModuleValidator, { id: '7' }), null);
  });
  it('rejects non-integer', async () => {
    assert.ok(await getErrorWithParams(deleteModuleValidator, { id: 'x' }));
  });
});

describe('createModuleCategoryValidator', () => {
  it('accepts valid data', async () => {
    const req = { body: { title: 'Notes', iconName: 'book' }, params: { moduleId: '1' }, query: {} };
    for (const v of createModuleCategoryValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('rejects missing title', async () => {
    const req = { body: { iconName: 'book' }, params: { moduleId: '1' }, query: {} };
    for (const v of createModuleCategoryValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), false);
  });
});

describe('getModuleCategoriesValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(getModuleCategoriesValidator, { moduleId: '2' }), null);
  });
});

describe('updateModuleCategoryValidator', () => {
  it('accepts valid data', async () => {
    const req = { body: { title: 'Videos', iconName: 'play' }, params: { categoryId: '5' }, query: {} };
    for (const v of updateModuleCategoryValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
});

describe('deleteModuleCategoryValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(deleteModuleCategoryValidator, { categoryId: '3' }), null);
  });
});

describe('uploadMaterialValidator', () => {
  it('accepts file upload', async () => {
    const req = { body: { title: 'Chapter 1', category: '1', attachmentType: 'Upload File' }, params: { moduleId: '1' }, query: {} };
    for (const v of uploadMaterialValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('accepts link upload with URL', async () => {
    const req = { body: { title: 'Tutorial', category: '2', attachmentType: 'Attach Link', linkUrl: 'https://example.com' }, params: { moduleId: '1' }, query: {} };
    for (const v of uploadMaterialValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('rejects link upload missing URL', async () => {
    const req = { body: { title: 'Tutorial', category: '2', attachmentType: 'Attach Link' }, params: { moduleId: '1' }, query: {} };
    for (const v of uploadMaterialValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), false);
  });
  it('rejects invalid attachmentType', async () => {
    const err = await getError(uploadMaterialValidator, { title: 'X', category: '1', attachmentType: 'PDF' });
    assert.ok(err);
  });
});

describe('editMaterialValidator', () => {
  it('accepts valid edit', async () => {
    const req = { body: { title: 'New Title' }, params: { materialId: '5' }, query: {} };
    for (const v of editMaterialValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('rejects non-integer categoryId', async () => {
    const req = { body: { categoryId: 'abc' }, params: { materialId: '5' }, query: {} };
    for (const v of editMaterialValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), false);
  });
});

describe('deleteMaterialValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(deleteMaterialValidator, { materialId: '9' }), null);
  });
});

describe('getMaterialsByCategoryValidator', () => {
  it('accepts valid params', async () => {
    const req = { body: {}, params: { moduleId: '1', categoryId: '2' }, query: {} };
    for (const v of getMaterialsByCategoryValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
});

describe('getBatchRepsValidator', () => {
  it('accepts valid query', async () => {
    assert.equal(await getErrorWithQuery(getBatchRepsValidator, { degreeId: '3' }), null);
  });
  it('rejects missing degreeId', async () => {
    assert.ok(await getErrorWithQuery(getBatchRepsValidator, {}));
  });
});

describe('getSemesterVisibilityValidator', () => {
  it('accepts valid query', async () => {
    assert.equal(await getErrorWithQuery(getSemesterVisibilityValidator, { degreeId: '1', semesterId: '2' }), null);
  });
});

describe('updateSemesterVisibilityValidator', () => {
  it('accepts valid data', async () => {
    const req = { body: { visibleBatchIds: [1, 2, 3] }, params: { degreeId: '1', semesterId: '2' }, query: {} };
    for (const v of updateSemesterVisibilityValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), true);
  });
  it('rejects non-array visibleBatchIds', async () => {
    const req = { body: { visibleBatchIds: 'all' }, params: { degreeId: '1', semesterId: '2' }, query: {} };
    for (const v of updateSemesterVisibilityValidator) await v.run(req);
    assert.equal(validationResult(req).isEmpty(), false);
  });
});

describe('getBatchRepCourseStructureValidator', () => {
  it('accepts valid query', async () => {
    assert.equal(await getErrorWithQuery(getBatchRepCourseStructureValidator, { degreeId: '4' }), null);
  });
});
