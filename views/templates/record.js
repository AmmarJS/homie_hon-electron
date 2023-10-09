export function row({ id, date_added: date, title, amount }) {
    return `
    <tr id="${id}" dir="ltr">
    <td scope="col" class="p-4 h-[100px] border">${(new Date(date)).toLocaleString()}</td>
    <td scope="col" class="p-4 h-[100px] border">${title}</td>
    <td scope="col" class="p-4 h-[100px] border numerical-amount">${amount}</td>
    <td scope="col" class="p-4 h-[100px] border"><a href="#" class="hover:text-slate-500 transition-all delete-btn">حذف</a></td>
    </tr>
    `
}