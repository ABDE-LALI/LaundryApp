export default function EditEmployesGrid({ users, setShowModifyEmpForm, setModifyEmploye, handleDeleteEmploye }) {
    console.log(users);
    
    return (<div className="max-h-[87vh] overflow-y-auto">
                    <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-6">
                        {users?.map((user) => (
                            <div key={user.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`/storage/images/user.png`}
                                        alt={user.name}
                                        className="object-cover rounded-md mb-3"
                                    />
                                    <span className="text-lg font-semibold text-gray-700">{user.firstname}</span>
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => {
                                            setShowModifyEmpForm(true);
                                            setModifyEmploye(user);
                                        }}
                                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    >
                                        Modify
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEmploye(user.id)}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>)}