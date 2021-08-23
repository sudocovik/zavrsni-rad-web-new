<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Http\Requests\StoreCard;
use App\Http\Requests\UpdateCard;
use Illuminate\Http\JsonResponse;
use Throwable;

class CardController extends Controller
{
    public function index(): JsonResponse
    {
        $cardsByCreationDateAscending = Card::query()->select(['id', 'name', 'uid'])->orderBy('created_at')->get();

        return response()->json([
            'data' => $cardsByCreationDateAscending
        ]);
    }

    public function store(StoreCard $request): JsonResponse
    {
        $name = $request->name;
        $uid = $request->uid;

        $card = new Card();
        $card->name = $name;
        $card->uid = $uid;

        if ($card->save()) {
            return response()->json([
                'data' => $card->fresh()
            ]);
        }

        return response()->json(['data' => 'Neuspješna pohrana kartice. Pokušajte ponovo!']);
    }

    public function update(Card $card, UpdateCard $request): JsonResponse
    {
        $card->name = $request->name;

        if ($card->save()) {
            return response()->json([
                'data' => $card->fresh()
            ]);
        }

        return response()->json(['data' => 'Neuspješno ažuriranje kartice. Pokušajte ponovo!']);
    }

    public function destroy(Card $card): JsonResponse
    {
        try {
            $card->delete();

            return response()->json(['data' => 'Kartica uspješno obrisana.']);
        }
        catch (Throwable $exception) {
            return response()->json(['data' => 'Neuspješno brisanje kartice. Pokušajte ponovo!']);
        }
    }
}
