<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TicketController;
use App\Models\Article;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware(['auth', 'verified'])->group(function () {
    //this route to store the ticket
    Route::post('serve/ticket/store', [TicketController::class, 'storeTicket'])->name('serve.ticket.store');
    //this route to store the orders
    Route::post('/serve/store', [OrderController::class, 'store'])->name('serve.store');
    //this page contains the statistics
    Route::get('/serve/statistics', function () {
        return Inertia::render('Serve/Statistics');
    })->name('serve.statistics');
    //this page contains the form to create a new order
    Route::get('/serve/create', [OrderController::class, 'index'])->name('serve.create');
    //this page contains the history of recent orders
    Route::get('/serve/history', function () {
        return Inertia::render('Serve/History');
    })->name('serve.history');
    //this page contains the form to edit a specific order
    Route::get('/serve/{order?}/edit', function () {
        return Inertia::render('Serve/Edit');
    })->name('serve.edit');
    //this page contains the form to delete a specific order
    Route::get('/serve/{order?}/delete', function () {
        return Inertia::render('Serve/Delete');
    })->name('serve.delete');
    //this page contains the details of a specific order
    Route::get('/serve/{order?}', function () {
        return Inertia::render('Serve/Show');
    })->name('serve.show');
});
Route::middleware(['auth', 'verified'])->group(function () {
    //this page contains the settings of the user
    Route::get('settings', [ArticleController::class, 'index'])
        ->name('settings');
    Route::get('settings/addArticle', [ArticleController::class, 'create'])
        ->name('settings.addArticle');
    Route::post('settings/storeArticle', [ArticleController::class, 'store'])
        ->name('settings.storeArticle');
    Route::get('settings/editArticle/{article}', [ArticleController::class, 'edit'])
        ->name('settings.editArticle');
    Route::patch('settings/updateArticle/{article}', [ArticleController::class, 'update'])
        ->name('settings.updateArticle');
    Route::delete('settings/deleteArticle/{article}', [ArticleController::class, 'destroy'])
        ->name('settings.deleteArticle');
    Route::get('settings/addService', function () {
        return Inertia::render('Settings/AddService');
    })->name('settings.addService');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
