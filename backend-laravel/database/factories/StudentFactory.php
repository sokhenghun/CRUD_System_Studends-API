<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional()->numerify('0########'),
            'course' => fake()->randomElement([
                'Computer Science',
                'Information Technology',
                'Software Engineering',
                'Data Science',
            ]),
            'year_level' => fake()->numberBetween(1, 4),
        ];
    }
}
