import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError } from '../helpers/testUtils.js';
import {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  resendOTPValidator,
  forgotPasswordValidator,
  verifyResetOTPValidator,
  resetPasswordValidator,
} from '../../src/validators/auth.validator.js';

describe('registerValidator', () => {
  const validStudent = {
    name: 'John Doe',
    email: 'john@uom.lk',
    password: 'Pass123!@',
    role: 'Student',
  };

  it('accepts valid student registration', async () => {
    assert.equal(await getError(registerValidator, validStudent), null);
  });

  it('rejects non-uom.lk email for students', async () => {
    const err = await getError(registerValidator, { ...validStudent, email: 'john@gmail.com' });
    assert.match(err, /@uom\.lk/);
  });

  it('rejects weak password (no uppercase)', async () => {
    const err = await getError(registerValidator, { ...validStudent, password: 'pass123!@' });
    assert.match(err, /Password/);
  });

  it('rejects weak password (no special char)', async () => {
    const err = await getError(registerValidator, { ...validStudent, password: 'Password1' });
    assert.match(err, /Password/);
  });

  it('rejects short password', async () => {
    const err = await getError(registerValidator, { ...validStudent, password: 'Ab1!@#' });
    assert.match(err, /Password/);
  });

  it('rejects missing role', async () => {
    const err = await getError(registerValidator, { email: 'test@uom.lk', password: 'Pass123!@' });
    assert.match(err, /Role/);
  });

  it('rejects invalid role', async () => {
    const err = await getError(registerValidator, { ...validStudent, role: 'InvalidRole' });
    assert.match(err, /role/);
  });

  it('allows Business registration without email if phone is provided', async () => {
    const err = await getError(registerValidator, {
      role: 'Business',
      phone: '+94771234567',
      password: 'Pass123!@',
    });
    assert.equal(err, null);
  });

  it('rejects Business registration without email and phone', async () => {
    const err = await getError(registerValidator, { role: 'Business', password: 'Pass123!@' });
    assert.match(err, /email|phone/);
  });

  it('rejects invalid phone number format', async () => {
    const err = await getError(registerValidator, { ...validStudent, phone: 'abc' });
    assert.match(err, /phone/);
  });

  it('accepts valid registration with optional name omitted', async () => {
    const err = await getError(registerValidator, {
      email: 'alice@uom.lk',
      password: 'Alice123!@',
      role: 'Student',
    });
    assert.equal(err, null);
  });
});

describe('loginValidator', () => {
  it('accepts email login', async () => {
    assert.equal(await getError(loginValidator, { email: 'john@uom.lk', password: 'secret' }), null);
  });

  it('accepts phone login', async () => {
    assert.equal(await getError(loginValidator, { phone: '+94771234567', password: 'secret' }), null);
  });

  it('accepts identifier login', async () => {
    assert.equal(await getError(loginValidator, { identifier: 'john@uom.lk', password: 'secret' }), null);
  });

  it('rejects missing password', async () => {
    const err = await getError(loginValidator, { email: 'john@uom.lk' });
    assert.match(err, /Password/);
  });

  it('rejects missing email and phone', async () => {
    const err = await getError(loginValidator, { password: 'secret' });
    assert.ok(err);
  });
});

describe('verifyOTPValidator', () => {
  it('accepts valid OTP with email', async () => {
    assert.equal(await getError(verifyOTPValidator, { email: 'john@uom.lk', otp: '123456' }), null);
  });

  it('accepts valid OTP with phone', async () => {
    assert.equal(await getError(verifyOTPValidator, { phone: '+94771234567', otp: '123456' }), null);
  });

  it('rejects OTP not 6 digits', async () => {
    const err = await getError(verifyOTPValidator, { email: 'john@uom.lk', otp: '12345' });
    assert.match(err, /OTP|must be 6/);
  });

  it('rejects missing OTP', async () => {
    const err = await getError(verifyOTPValidator, { email: 'john@uom.lk' });
    assert.match(err, /OTP/);
  });

  it('rejects missing email and phone', async () => {
    const err = await getError(verifyOTPValidator, { otp: '123456' });
    assert.ok(err);
  });
});

describe('resendOTPValidator', () => {
  it('accepts email', async () => {
    assert.equal(await getError(resendOTPValidator, { email: 'john@uom.lk' }), null);
  });

  it('accepts phone', async () => {
    assert.equal(await getError(resendOTPValidator, { phone: '+94771234567' }), null);
  });

  it('rejects missing both', async () => {
    const err = await getError(resendOTPValidator, {});
    assert.ok(err);
  });
});

describe('forgotPasswordValidator', () => {
  it('accepts email', async () => {
    assert.equal(await getError(forgotPasswordValidator, { email: 'john@uom.lk' }), null);
  });

  it('rejects empty body', async () => {
    const err = await getError(forgotPasswordValidator, {});
    assert.ok(err);
  });
});

describe('verifyResetOTPValidator', () => {
  it('accepts valid OTP with email', async () => {
    assert.equal(await getError(verifyResetOTPValidator, { email: 'john@uom.lk', otp: '654321' }), null);
  });

  it('rejects missing OTP', async () => {
    const err = await getError(verifyResetOTPValidator, { email: 'john@uom.lk' });
    assert.match(err, /OTP/);
  });
});

describe('resetPasswordValidator', () => {
  it('accepts valid reset data', async () => {
    assert.equal(await getError(resetPasswordValidator, {
      email: 'john@uom.lk',
      otp: '123456',
      password: 'NewPass123!',
    }), null);
  });

  it('rejects short password', async () => {
    const err = await getError(resetPasswordValidator, {
      email: 'john@uom.lk',
      otp: '123456',
      password: 'Abc12',
    });
    assert.match(err, /Password/);
  });
});
