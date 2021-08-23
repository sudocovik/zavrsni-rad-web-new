<?php

namespace App\Http\Requests;

use App\Models\Card;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCard extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:30',
                Rule::unique(Card::class, 'name')
            ],
            'uid' => [
                'required',
                'string',
                'max:40',
                Rule::unique(Card::class, 'uid')
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Ime već postoji.',
            'name.max' => 'Ime može biti maksimalno 30 znakova.',
            'name.*' => 'Ime je obavezno.',
            'uid.unique' => 'UID već postoji.',
            'uid.max' => 'UID može biti maksimalno 40 znakova.',
            'uid.*' => 'UID je obavezan.'
        ];
    }
}
