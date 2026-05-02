<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Student::query()->latest()->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = Student::create($request->validated());

        return response()->json($student, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return $student;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $student->update($request->validated());

        return $student->fresh();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }
}
