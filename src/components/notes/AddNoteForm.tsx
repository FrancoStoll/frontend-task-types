const AddNoteForm = () => {
  return (
    <form className="space-y-3" onSubmit={() => {}} noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          type="text"
          id="content"
          placeholder="Contenido de la nota"
          className="w-full p-3 border border-gray-300"
        />
      </div>
      <input
        type="submit"
        value="Crear Nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-900 w-full p-2 font-black cursor-pointer text-white"
      />
    </form>
  );
};
export default AddNoteForm;
