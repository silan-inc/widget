/**
 * Created by dingyuxuan on 2017/4/5.
 */

let Index_ = () => {
    if (localStorage.getItem('userInfo') !== null &&
        JSON.parse(localStorage.getItem('userInfo'))) {
        $$('.withoutLogin').hide();
    }
};

export default Index_;
