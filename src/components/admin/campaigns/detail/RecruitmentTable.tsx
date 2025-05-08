import { useState } from 'react';
import { Check, CalendarDays, Pencil, Plus, Trash2, Undo2, X, AlertCircle } from 'lucide-react';

export interface RecruitmentDay {
    date: string; // YYYY-MM-DD 형식
    quota: number; // 모집 인원
    description?: string; // 비고 (선택 사항)
}

interface EditableRecruitmentDay extends RecruitmentDay {
    isDeleted?: boolean;
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
}

function RecruitmentRow({ day, isCurrentDayOrBefore }: { day: RecruitmentDay; isCurrentDayOrBefore: boolean }) {
    const isToday = new Date(day.date).toDateString() === new Date().toDateString();

    return (
        <tr className={`hover:bg-gray-50 border-b ${isToday ? 'bg-blue-50' : ''}`}>
            <td className="px-4 py-3 text-left">{formatDate(day.date)}</td>
            <td className="px-4 py-3 text-center">{day.quota}명</td>
            <td className="px-4 py-3 text-left">{day.description || '-'}</td>
            <td className="px-4 py-3 text-right space-x-2">
                {isCurrentDayOrBefore && (
                    <span className="text-xs text-gray-400 flex items-center justify-end">
                        <AlertCircle size={12} className="mr-1" /> 지난 모집은 수정 불가
                    </span>
                )}
            </td>
        </tr>
    );
}

function RecruitmentInputRow({
                                 day,
                                 onChange,
                                 onCancel,
                                 className = "bg-gray-50",
                                 isDeleted = false,
                                 onRestore,
                                 isCurrentDayOrBefore,
                             }: {
    day: RecruitmentDay;
    onChange: (day: RecruitmentDay) => void;
    onCancel: () => void;
    className?: string;
    isDeleted?: boolean;
    onRestore?: () => void;
    isCurrentDayOrBefore: boolean;
}) {
    return (
        <tr className={`${className} border-b ${isDeleted ? 'line-through text-gray-400 opacity-60' : ''}`}>
            <td className="px-4 py-3 text-left">
                <input
                    disabled={isDeleted || isCurrentDayOrBefore}
                    type="date"
                    value={day.date}
                    onChange={(e) => onChange({ ...day, date: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
            </td>
            <td className="px-4 py-3 text-center">
                <input
                    disabled={isDeleted || isCurrentDayOrBefore}
                    type="number"
                    min={0}
                    value={day.quota}
                    onChange={(e) => onChange({ ...day, quota: parseInt(e.target.value, 10) || 0 })}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                />
            </td>
            <td className="px-4 py-3 text-left">
                <input
                    disabled={isDeleted || isCurrentDayOrBefore}
                    type="text"
                    value={day.description || ''}
                    onChange={(e) => onChange({ ...day, description: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="모집 관련 비고 사항"
                />
            </td>
            <td className="px-4 py-3 text-right space-x-2">
                {isCurrentDayOrBefore ? (
                    <span className="text-xs text-gray-400 flex items-center justify-end">
                        <AlertCircle size={12} className="mr-1" /> 지난 모집은 수정 불가
                    </span>
                ) : isDeleted ? (
                    <button onClick={onRestore} className="text-blue-500 hover:text-blue-700">
                        <Undo2 size={16} />
                    </button>
                ) : (
                    <button onClick={onCancel} className="text-red-600 hover:text-red-800">
                        <X size={16} />
                    </button>
                )}
            </td>
        </tr>
    );
}

function RecruitmentEditRow({
                                day,
                                onChange,
                                onMarkDelete,
                                onRestore,
                                isCurrentDayOrBefore,
                            }: {
    day: EditableRecruitmentDay;
    onChange: (day: EditableRecruitmentDay) => void;
    onMarkDelete: () => void;
    onRestore: () => void;
    isCurrentDayOrBefore: boolean;
}) {
    return (
        <RecruitmentInputRow
            day={day}
            onChange={onChange}
            onCancel={onMarkDelete}
            onRestore={onRestore}
            className="bg-blue-50"
            isDeleted={day.isDeleted}
            isCurrentDayOrBefore={isCurrentDayOrBefore}
        />
    );
}

export default function RecruitmentTable({ initialDays }: { initialDays: RecruitmentDay[] }) {
    const [daysList, setDaysList] = useState<RecruitmentDay[]>(initialDays);
    const [addingRows, setAddingRows] = useState<RecruitmentDay[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedDays, setEditedDays] = useState<EditableRecruitmentDay[]>([]);

    // 현재 날짜 기준으로 이전 날짜인지 체크하는 함수
    const isDateBeforeToday = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
    const getTodayFormatted = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const addNewRow = () => {
        if (!isEditMode) return;
        setAddingRows([...addingRows, { date: getTodayFormatted(), quota: 0 }]);
    };

    const updateNewRow = (index: number, newDay: RecruitmentDay) => {
        const updated = [...addingRows];
        updated[index] = newDay;
        setAddingRows(updated);
    };

    const cancelNewRow = (index: number) => {
        setAddingRows(addingRows.filter((_, i) => i !== index));
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setEditedDays(daysList.map(d => ({ ...d })));
        setAddingRows([]);
    };

    const updateEditedRow = (index: number, updated: EditableRecruitmentDay) => {
        const copy = [...editedDays];
        copy[index] = updated;
        setEditedDays(copy);
    };

    const markDayAsDeleted = (index: number) => {
        const copy = [...editedDays];
        copy[index] = { ...copy[index], isDeleted: true };
        setEditedDays(copy);
    };

    const restoreDeletedDay = (index: number) => {
        const copy = [...editedDays];
        copy[index] = { ...copy[index], isDeleted: false };
        setEditedDays(copy);
    };

    const saveAllEdits = () => {
        const filtered = editedDays.filter(d => !d.isDeleted);
        setDaysList([...filtered, ...addingRows]);
        setEditedDays([]);
        setAddingRows([]);
        setIsEditMode(false);
    };

    const cancelEdit = () => {
        setIsEditMode(false);
        setEditedDays([]);
        setAddingRows([]);
    };

    return (
        <section className="">
            <p className="text-sm text-gray-500 mb-4">날짜별로 모집 인원을 등록하거나 수정할 수 있습니다.</p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
                <div className="max-h-[250px] overflow-y-auto">
                    <table className="w-full table-fixed text-sm text-gray-900 border-collapse">
                        <thead className="bg-gray-100 text-xs font-semibold text-gray-600 sticky top-0 z-10">
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left w-[30%]">모집일</th>
                            <th className="px-4 py-2 text-left w-[8rem]">인원</th>
                            <th className="px-4 py-2 text-left w-[8rem]">비고</th>
                            <th className="px-4 py-2 text-right w-[6rem]">
                                <div className="flex justify-end gap-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={addNewRow}
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                aria-label="모집일 추가"
                                            >
                                                <Plus size={14} className="text-gray-600" />
                                            </button>
                                            <button
                                                onClick={saveAllEdits}
                                                className="p-1 border border-green-500 rounded-md hover:bg-green-100"
                                                aria-label="저장"
                                            >
                                                <Check size={14} className="text-green-600" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-1 border border-red-400 rounded-md hover:bg-red-100"
                                                aria-label="취소"
                                            >
                                                <X size={14} className="text-red-600" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={toggleEditMode}
                                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                            aria-label="수정 모드"
                                        >
                                            <Pencil size={14} className="text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {!isEditMode
                            ? daysList.map((day, idx) => (
                                <RecruitmentRow
                                    key={`view-${idx}`}
                                    day={day}
                                    isCurrentDayOrBefore={isDateBeforeToday(day.date)}
                                />
                            ))
                            : editedDays.map((day, idx) => (
                                <RecruitmentEditRow
                                    key={`edit-${idx}`}
                                    day={day}
                                    onChange={(updated) => updateEditedRow(idx, updated)}
                                    onMarkDelete={() => markDayAsDeleted(idx)}
                                    onRestore={() => restoreDeletedDay(idx)}
                                    isCurrentDayOrBefore={isDateBeforeToday(day.date)}
                                />
                            ))}

                        {addingRows.map((row, idx) => (
                            <RecruitmentInputRow
                                key={`new-${idx}`}
                                day={row}
                                onChange={(updated) => updateNewRow(idx, updated)}
                                onCancel={() => cancelNewRow(idx)}
                                className="bg-yellow-50"
                                isCurrentDayOrBefore={false} // 새로 추가되는 행은 항상 수정 가능
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}