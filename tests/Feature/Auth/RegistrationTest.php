<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'phone' => '5550001234',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('phone number must be unique to register', function () {
    User::factory()->create([
        'phone' => '5550001234',
    ]);

    $response = $this->post(route('register.store'), [
        'name' => 'Another User',
        'phone' => '5550001234',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('phone');
    $this->assertGuest();
});
