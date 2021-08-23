<?php

namespace App\Http\Requests;

use App\Models\Card;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCard extends FormRequest
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
        $cardUnderModification = $this->route('card');

        return [
            'name' => [
                'required',
                'string',
                'max:30',
                Rule::unique(Card::class, 'name')->ignore($cardUnderModification->id)
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Ime već postoji.',
            'name.max' => 'Ime može biti maksimalno 30 znakova.',
            'name.*' => 'Ime je obavezno.'
        ];
    }
}
