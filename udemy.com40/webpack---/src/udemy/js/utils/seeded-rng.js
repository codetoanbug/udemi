import MersenneTwister from 'mersenne-twister';

/**
 * This module exports utilities for *seeded* randomization, which is not supported
 * by native JS methods.
 */

export function createRNG(seed) {
    return new MersenneTwister(seed);
}

export function shuffle(array, rng) {
    for (let i = array.length; i; i--) {
        const j = Math.floor(rng.random() * i);
        [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
    return array;
}
