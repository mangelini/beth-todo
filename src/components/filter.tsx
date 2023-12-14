function Filter() {
  return (
    <div class="rounded-md border p-4 shadow-lg">
      <form
        hx-post="/api/todo/fetchFilteredTodos"
        hx-target="#todoList"
        hx-swap="innerHTML"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
      >
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          name="description"
          placeholder="Filter by description"
          class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          class="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}

export default Filter;
