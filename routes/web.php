<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ServiceArticleController;
use App\Http\Controllers\TicketController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('/serve/get-article-service-price/{article_id}/{service_id}', [ServiceArticleController::class, 'getPrice'])
        ->name('serve.getArticleServicePrice');
    Route::post('/serve/ticket/store', [TicketController::class, 'storeTicket'])->name('serve.ticket.store');
    Route::post('/serve/store', [OrderController::class, 'store'])->name('serve.store');

    // Updated to use OrderController::getStatistics and return Inertia response
    Route::get('/serve/statistics', [OrderController::class, 'getStatistics'])
        ->name('serve.statistics');

    Route::get('/serve/create', [OrderController::class, 'index'])->name('serve.create');
    Route::get('/serve/search', function () {
        return Inertia::render('Serve/Search');
    })->name('serve.search');
    Route::get('/serve/get-recent-tickets', [TicketController::class, 'getRecentTickets'])->name('serve.getRecentTickets');
    Route::get('/serve/get-ticket/{id}', [TicketController::class, 'getTicket'])->name('serve.getTicket');
    Route::put('/serve/set-order-status/{orderId}/{status}', [OrderController::class, 'setStatus'])->name('serve.setStatus');
    Route::put('/serve/set-ticket-status/{ticketId}/{status}', [TicketController::class, 'setStatus'])->name('serve.setStatus');
    Route::get('/serve/{order?}/edit', function () {
        return Inertia::render('Serve/Edit');
    })->name('serve.edit');
    Route::get('/serve/{order?}/delete', function () {
        return Inertia::render('Serve/Delete');
    })->name('serve.delete');

    // Keep this for dynamic JSON fetching if needed
    Route::get('/serve/statistics-data', [OrderController::class, 'getStatisticsJson'])->name('serve.statistics.data');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings', [ArticleController::class, 'index'])->name('settings');
    Route::post('/settings/storeArticle', [ArticleController::class, 'store'])->name('settings.storeArticle');
    Route::get('/settings/editArticle/{article}', [ArticleController::class, 'edit'])->name('settings.editArticle');
    Route::put('/settings/updateArticle', [ArticleController::class, 'update'])->name('settings.updateArticle');
    Route::delete('/settings/deleteArticle/{article}', [ArticleController::class, 'destroy'])->name('settings.deleteArticle');
    Route::get('/settings/addService', function () {
        return Inertia::render('Settings/AddService');
    })->name('settings.addService');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
