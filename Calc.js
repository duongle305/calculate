/* 
    *****| Code chỉ dành cho sinh viên GTS |*****
    - Truy cập trang sinh viên: https://sv.ut.edu.vn
    - Đăng nhập tải khoản sinh viên
    - Vào trang "Kết quả học tập" -> https://sv.ut.edu.vn/Xemdiem.aspx
    - Copy đoạn code bên dưới và past ở tab console của chrome.
*/

class Calc {
    $table = $('.tblKetQuaHocTap');
    $trs = this.$table.find('tr');
    // Danh sách mã môn học không công vào điểm trung bình tích lũy
    exceptCourses = ['007006', '004001', '007007', '004002', '007008', '004003'];
    semesters = [];

    constructor() {
        this.getAllCourses()
            .calculate();
    }

    calculate() {
        let showLogs = confirm('Bạn có muốn hiện thông tin ở màn hình console không?');
        this.semesters.reverse()
            .forEach(sem => {
                let credits = 0, sumMark = 0;
                for (let course of sem.courses) {
                    if (!this.exceptCourses.includes(course.code) && !(course.note !== "")) {
                        credits += course.credits;
                        sumMark += (course.credits * course.markFour);
                    }
                }
                $(sem.tr.children()[0]).append(` - <span style="color: darkred; font-weight: bold;">${Math.round(parseFloat(sumMark / credits) * 100) / 100}</span>`);
                if (showLogs) {
                    console.log('%c ' + sem.name, 'color: #f98000; font-size: 16px;');
                    console.log(`%c Tổng số chỉ: %c ${credits} %c - Tổng điểm hệ 4: %c ${sumMark} %c - Điểm trung bình HK: %c ${Math.round(parseFloat(sumMark / credits) * 100) / 100}`,
                        'font-size: 14px',
                        'font-size: 14px; color: red',
                        'font-size: 14px',
                        'font-size: 14px; color: red',
                        'font-size: 14px',
                        'font-size: 14px; color: red',
                    );
                }
            });
    }

    getAllCourses() {
        let semester = {
            name: '',
            courses: []
        };
        for (let index = this.$trs.length - 4; index > 2; index--) {
            let $tr = $(this.$trs[index]);
            let except = /^H(.*) hè (.*)$/.test($tr.children().text().trim());
            let course = Object.create({});
            if ($tr.children().length > 1) {
                course.code = $tr.children()[1].innerText.trim();
                course.name = $tr.children()[2].innerText.trim();
                course.class = $tr.children()[3].innerText.trim();
                course.credits = parseInt($tr.children()[4].innerText.trim());
                if ($tr.children().length === 17) {
                    course.markTen = $tr.children()[12].innerText.trim();
                    course.markFour = $tr.children()[13].innerText.trim();
                    course.note = $tr.children()[16].innerText.trim();
                } else {
                    course.markFour = $tr.children()[10].innerText.trim();
                    course.markTen = $tr.children()[9].innerText.trim();
                    course.note = $tr.children()[13].innerText.trim();
                }
                course.markTen = parseFloat(course.markTen);
                course.markFour = parseFloat(course.markFour);
                semester.courses.push(course);
            }
            if (!except && $tr.hasClass('quater')) {
                semester.tr = $tr;
                semester.name = $tr.text().trim();
                this.semesters.push(semester);
                semester = {
                    name: '',
                    courses: [],
                };
            }
        }
        return this;
    }
}

$(() => {
    new Calc();
});
