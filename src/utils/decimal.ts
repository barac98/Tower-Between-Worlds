/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class Decimal {
  mantissa: number;
  exponent: number;

  constructor(mantissa: number, exponent: number = 0) {
    if (mantissa === 0) {
      this.mantissa = 0;
      this.exponent = 0;
    } else {
      this.mantissa = mantissa;
      this.exponent = exponent;
      this.normalize();
    }
  }

  private normalize() {
    if (this.mantissa === 0) {
      this.exponent = 0;
      return;
    }

    // Convert negative if any, but our game is positive numbers only.
    let isNegative = this.mantissa < 0;
    let m = Math.abs(this.mantissa);
    let e = this.exponent;

    if (m >= 1e9 || m <= 1e-9) {
      const shift = Math.floor(Math.log10(m));
      m = m / Math.pow(10, shift);
      e += shift;
    } else {
      while (m >= 10) {
        m /= 10;
        e += 1;
      }
      while (m < 1 && m > 0) {
        m *= 10;
        e -= 1;
      }
    }

    this.mantissa = isNegative ? -m : m;
    this.exponent = e;
  }

  static from(val: Decimal | number | string): Decimal {
    if (val instanceof Decimal) {
      return new Decimal(val.mantissa, val.exponent);
    }
    if (typeof val === 'number') {
      if (isNaN(val) || !isFinite(val)) return new Decimal(0, 0);
      return new Decimal(val, 0);
    }
    if (typeof val === 'string') {
      const clean = val.trim().toLowerCase();
      if (!clean || clean === '0') return new Decimal(0, 0);
      
      if (clean.includes('e')) {
        const parts = clean.split('e');
        const m = parseFloat(parts[0]);
        const e = parseInt(parts[1], 10);
        return new Decimal(m, e);
      }
      
      const num = parseFloat(clean);
      return new Decimal(num, 0);
    }
    return new Decimal(0, 0);
  }

  add(other: Decimal | number | string): Decimal {
    const o = Decimal.from(other);
    if (this.mantissa === 0) return o;
    if (o.mantissa === 0) return this;

    const diff = this.exponent - o.exponent;
    if (diff >= 17) {
      return this; // other is too small to affect this
    }
    if (diff <= -17) {
      return o; // this is too small to affect other
    }

    if (this.exponent >= o.exponent) {
      const newMantissa = this.mantissa + o.mantissa * Math.pow(10, -diff);
      return new Decimal(newMantissa, this.exponent);
    } else {
      const newMantissa = o.mantissa + this.mantissa * Math.pow(10, diff);
      return new Decimal(newMantissa, o.exponent);
    }
  }

  sub(other: Decimal | number | string): Decimal {
    const o = Decimal.from(other);
    if (o.mantissa === 0) return this;
    if (this.mantissa === 0) return new Decimal(0, 0);

    const diff = this.exponent - o.exponent;
    if (diff >= 17) {
      return this;
    }
    if (diff <= -17) {
      return new Decimal(0, 0); // Negative result clamped to 0
    }

    const newMantissa = this.mantissa - o.mantissa * Math.pow(10, -diff);
    if (newMantissa <= 0) {
      return new Decimal(0, 0);
    }
    return new Decimal(newMantissa, this.exponent);
  }

  mul(other: Decimal | number | string): Decimal {
    const o = Decimal.from(other);
    if (this.mantissa === 0 || o.mantissa === 0) {
      return new Decimal(0, 0);
    }
    return new Decimal(this.mantissa * o.mantissa, this.exponent + o.exponent);
  }

  div(other: Decimal | number | string): Decimal {
    const o = Decimal.from(other);
    if (o.mantissa === 0) {
      // Avoid division by zero, return infinity equivalent or safe value
      return new Decimal(0, 0);
    }
    if (this.mantissa === 0) {
      return new Decimal(0, 0);
    }
    return new Decimal(this.mantissa / o.mantissa, this.exponent - o.exponent);
  }

  pow(power: number): Decimal {
    if (power === 0) return new Decimal(1, 0);
    if (this.mantissa === 0) return new Decimal(0, 0);
    
    // x^p = (m * 10^e)^p = m^p * 10^(e * p)
    const newExponent = Math.floor(this.exponent * power);
    const remainder = (this.exponent * power) - newExponent;
    const newMantissa = Math.pow(this.mantissa, power) * Math.pow(10, remainder);
    
    return new Decimal(newMantissa, newExponent);
  }

  compare(other: Decimal | number | string): number {
    const o = Decimal.from(other);
    
    // Account for signs
    const s1 = Math.sign(this.mantissa);
    const s2 = Math.sign(o.mantissa);
    
    if (s1 !== s2) {
      return s1 > s2 ? 1 : -1;
    }
    
    if (s1 === 0) return 0; // both are zero

    if (this.exponent !== o.exponent) {
      if (s1 > 0) {
        return this.exponent > o.exponent ? 1 : -1;
      } else {
        return this.exponent > o.exponent ? -1 : 1;
      }
    }

    if (Math.abs(this.mantissa - o.mantissa) < 1e-12) {
      return 0;
    }

    return this.mantissa > o.mantissa ? 1 : -1;
  }

  eq(other: Decimal | number | string): boolean {
    return this.compare(other) === 0;
  }

  gt(other: Decimal | number | string): boolean {
    return this.compare(other) > 0;
  }

  gte(other: Decimal | number | string): boolean {
    return this.compare(other) >= 0;
  }

  lt(other: Decimal | number | string): boolean {
    return this.compare(other) < 0;
  }

  lte(other: Decimal | number | string): boolean {
    return this.compare(other) <= 0;
  }

  toString(): string {
    if (this.mantissa === 0) return '0';
    return `${this.mantissa.toFixed(3)}e${this.exponent}`;
  }

  format(prec: number = 2): string {
    if (this.mantissa === 0) return '0';
    
    // Safe standard displays for smaller numbers
    if (this.exponent >= 0 && this.exponent < 3) {
      const full = this.mantissa * Math.pow(10, this.exponent);
      // If it has decimals, show some, else show round
      if (full % 1 === 0) return full.toString();
      return full.toFixed(prec);
    }

    if (this.exponent < 0) {
      // Tiny fractions
      if (this.exponent > -4) {
        const full = this.mantissa * Math.pow(10, this.exponent);
        return full.toFixed(4);
      }
      return `${this.mantissa.toFixed(prec)}e${this.exponent}`;
    }

    // Prefix system for incremental games
    const suffixes = [
      '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 
      'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg',
      'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'Tg'
    ];

    const suffixIndex = Math.floor(this.exponent / 3);
    const internalExponent = this.exponent % 3;

    if (suffixIndex < suffixes.length) {
      const dispValue = this.mantissa * Math.pow(10, internalExponent);
      const suffix = suffixes[suffixIndex];
      return `${dispValue.toFixed(prec)}${suffix ? ' ' + suffix : ''}`;
    }

    // Fallback to pure scientific representation
    return `${this.mantissa.toFixed(prec)}e${this.exponent}`;
  }
}
