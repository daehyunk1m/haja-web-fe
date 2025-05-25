import { expect, test } from "vitest";
import { sum } from "./exampleTest";

test("덧셈 테스트 1 + 2 = 3", () => {
  expect(sum(1, 2)).toBe(3);
});

// import { describe, expect, it } from 'vitest';
// import { Input } from '../components/Input';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

// describe('Input', async () => {
//   it('Input 컴포넌트 렌더링', () => {
//     // render() : <Input /> 렌더링
//     render(
//       <Input
//         name='email'
//         type='email'
//         placeholder='Email'
//         label='Email Address'
//       />
//     );
//     // 'Email Address' 텍스트를 포함한 요소가 화면에 존재하는지 검증
//     expect(screen.getByText('Email Address')).toBeInTheDocument();
//     // 'email address'라는 라벨을 가진 텍스트박스(role이 textbox인 요소)가 화면에 존재하는지를 검증
//     // toBeInTheDocument() : 특정 요소가 문서 안에 존재하는지를 테스트
//     expect(
//       screen.getByRole('textbox', {
//         name: /email address/i,
//       })
//     ).toBeInTheDocument();
//   });

//   // 특정 입력 요소의 값을 변경하는지를 테스트
//   it('Input 값 변경', async () => {
//     render(
//       <Input
//         name='email'
//         type='email'
//         placeholder='Email'
//         label='Email Address'
//       />
//     );

//     const input = screen.getByRole('textbox', {
//       name: /email address/i,
//     });

//     // userEvent.type()을 사용하여 input 요소에 '1234' 값 입력
//     await userEvent.type(input, '1234');
//     // 해당 input 요소의 값이 '1234'인지 확인
//     expect(input).toHaveValue('1234');
//   });
